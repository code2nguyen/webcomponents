import {
  html,
  css,
  LitElement,
  property,
  TemplateResult,
  query,
  customElement,
} from 'lit-element';
import {
  animationFrameScheduler,
  BehaviorSubject,
  combineLatest,
  ConnectableObservable,
  merge,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import {
  map,
  takeUntil,
  tap,
  switchMap,
  publishReplay,
  startWith,
  throttleTime,
  filter,
  distinctUntilChanged,
} from 'rxjs/operators';
import { GridCoordinator } from '../../shared/grid-coordinator';
import { LayoutService } from '../../shared/layout-service';
import {
  GridItemPosition,
  LayoutItems,
  PosistionOffset,
} from '../../shared/models';
import { Rect } from '../../shared/rect';
import { resizeObserver } from '../../shared/resize-observer';
import { RatioGridStyler } from '../../shared/styler';
import {
  adjustClientRect,
  getViewportScrollPosition,
  incrementVerticalScroll,
  Point,
  ScrollPosition,
  AUTO_SCROLL_STEP,
  getMutableClientRect,
  getViewportSize,
  getDistance,
  screenBreakpoints,
  screenColumnConfig,
  getRowHeight,
} from '../../shared/utils';
import { ScreenSize } from '../../shared/screen-size';
import { DashboardItem } from '../dashboard-item/dashboard-item.component';

declare const window: any;

@customElement('cff-dashboard-layout')
export class DashboardLayout extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      background-color: var(--dashboard-theme-color, #303236);
      margin: 8px;
    }

    .dashboard-layout__placeholder {
      display: block;
      position: absolute;
      overflow: hidden;
      z-index: -1;
      transition: left 0.4s, margin-top 0.4s, width 0.4s, padding-top 0.4s;
      background-color: rgba(
        var(--dashboard-layout-placeholder-bg-color, 255, 255, 255),
        0.1
      );
    }

    @media only screen and (max-width: 599.99px) {
      .fx-query-test {
        display: block;
      }
    }
    @media only screen and (min-width: 600px) and (max-width: 959.99px) {
      .fx-query-test {
        display: block;
      }
    }
    @media only screen and (min-width: 960px) and (max-width: 1279.99px) {
      .fx-query-test {
        display: block;
      }
    }
    @media only screen and (min-width: 1280px) {
      .fx-query-test {
        display: block;
      }
    }
  `;

  @property({ type: Number }) gutterSize = 8;

  #editable = false;
  @property({ type: Boolean })
  get editable() {
    return this.#editable;
  }
  set editable(value) {
    if (value !== this.#editable) {
      const oldValue = this.#editable;
      this.#editable = value;
      this.requestUpdate('editable', oldValue);

      if (value) {
        this._initEditMode();
      } else {
        this._removeEditMode();
      }
    }
  }

  @property({ type: String }) scrollableParentSelector?: string;
  @property({ type: Number }) paddingTop = 0;
  @property({ type: Number }) paddingBottom = 0;

  #disableFirstRenderAnimation = true;
  @property({ type: Boolean })
  public get disableFirstRenderAnimation() {
    return this.#disableFirstRenderAnimation;
  }
  public set disableFirstRenderAnimation(value) {
    this.#disableFirstRenderAnimation = value;
  }

  @query('.dashboard-layout__placeholder') placeHolder!: HTMLElement;

  layoutService: LayoutService;

  #destroyed$ = new Subject<void>();
  #elementRect!: ClientRect;
  #gridColumnWidth = 1;
  #gridRowHeight = 1;

  #gridCoordinator!: GridCoordinator;
  #styler!: RatioGridStyler;
  #removeEditMode$ = new Subject<void>();
  #rowHeightRatio = 1;

  #placeHolderElement?: HTMLElement;
  #shiftTargetKeys: string[] = [];
  #shiftTargets: Point[] = [];
  #targetPosition: GridItemPosition = {
    columnStart: 0,
    columnEnd: 0,
    rowEnd: 0,
    rowStart: 0,
  };
  #scrollNode: HTMLElement | Window | null = null;
  #scrollNodeRect: ClientRect | null | undefined = null;
  #scrollPosition: ScrollPosition = { top: 0, left: 0 };
  #viewportScrollSubscription = Subscription.EMPTY;
  #stopScrollTimers = new Subject<void>();
  #scrollDirection: 'UP' | 'DOWN' | 'NONE' = 'NONE';
  #activeItem?: DashboardItem;
  #orderedItems$: Observable<DashboardItem[]>;
  #dashboardItems: DashboardItem[] = [];
  #isPlacehoderVisible = false;
  #mediaQueries: MediaQueryList[] = [];
  #currentScreenSize: ScreenSize = ScreenSize.Large;
  #cols$ = new BehaviorSubject<number>(0);

  get cols(): number {
    return this.#cols$.value;
  }

  get elementRect(): ClientRect {
    return this.#elementRect;
  }

  get gridColumnWidth() {
    return this.#gridColumnWidth;
  }

  get gridRowHeight() {
    return this.#gridRowHeight;
  }

  constructor() {
    super();
    this.layoutService = new LayoutService(this);
    this.#orderedItems$ = combineLatest([
      this.#cols$.pipe(
        filter(cols => cols > 0),
        distinctUntilChanged(),
        tap(cols => {
          this._cacheDimension();
          this.#styler = new RatioGridStyler(
            cols,
            this.#rowHeightRatio,
            this.gutterSize,
            getRowHeight(this.#currentScreenSize)
          );
          this.#gridCoordinator = new GridCoordinator(cols);
          this._cacheDimension();
        })
      ),
      this.layoutService.items$.pipe(
        map(items =>
          items
            .map((item, index) => {
              item.order = item.order === undefined ? index : item.order;
              return item;
            })
            .sort((itemA, itemB) => itemA.order! - itemB.order!)
        ),
        tap(items => {
          items.forEach(item => {
            if (this.editable) {
              if (!item.editable) {
                item._initEditMode();
              }
            } else if (item.editable) {
              item._removeEditMode();
            }
          });
        }),
        tap(_ => {
          this.#gridCoordinator.reset();
        })
      ),
    ]).pipe(
      map(([cols, items]) => {
        const gridInitilized = this.#gridCoordinator.initilized;
        return items.map(item => {
          const rect =
            !gridInitilized || item.rect.isEmpty()
              ? new Rect({
                  columnStart: 0,
                  columnEnd: item.getCols(this.#currentScreenSize),
                  rowStart: 0,
                  rowEnd: item.rows,
                })
              : item.rect;
          const useColumnPack = gridInitilized && !item.rect.isEmpty();
          item.rect = useColumnPack
            ? this.#gridCoordinator.columnPack(rect)
            : this.#gridCoordinator.pack(rect);
          // item.rect = this.#gridCoordinator.pack(rect);
          return item;
        });
      }),
      tap(items => {
        this.#dashboardItems = items;
      }),
      throttleTime(0, animationFrameScheduler, {
        leading: false,
        trailing: true,
      }),
      publishReplay(1)
    );
  }

  disconnectedCallback() {
    this.#destroyed$.next();
    this.#destroyed$.complete();
    this.#dashboardItems = [];
    this._removeEditMode();
    this.#removeEditMode$.complete();
    this.stopScrollingProcess();
    this.#stopScrollTimers.complete();
    this.layoutService.destroy();
    super.disconnectedCallback();
    this._removeMediaQueryListener();
  }

  connectedCallback() {
    super.connectedCallback();
    this._updateCols();
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
      <div class="dashboard-layout__placeholder"></div>
    `;
  }

  async firstUpdated() {
    this._registerMediaQueries();
    this._listenMediaQueries();

    resizeObserver(this)
      .pipe(takeUntil(this.#destroyed$))
      .subscribe(entry => {
        this._cacheDimension();
      });

    this.#orderedItems$.pipe(takeUntil(this.#destroyed$)).subscribe(items => {
      this._layoutItems(this.#disableFirstRenderAnimation);
      this.#disableFirstRenderAnimation = false;
    });
    (this.#orderedItems$ as ConnectableObservable<DashboardItem[]>).connect();
  }

  handleScreenSizeChanged = (event: MediaQueryListEvent) => {
    this._updateCols();
  };

  // Base cols : 12/9/6/1
  private _updateCols() {
    for (const screenSize of Object.keys(ScreenSize)) {
      if (
        window.matchMedia(screenBreakpoints[screenSize as ScreenSize]).matches
      ) {
        this.#currentScreenSize = screenSize as ScreenSize;
        this.#cols$.next(screenColumnConfig[this.#currentScreenSize]);
        break;
      }
    }
  }

  private _registerMediaQueries() {
    for (const screenSize of Object.keys(ScreenSize)) {
      this.#mediaQueries.push(
        window.matchMedia(screenBreakpoints[screenSize as ScreenSize])
      );
    }
  }

  private _removeMediaQueryListener() {
    for (const query of this.#mediaQueries) {
      query.removeEventListener('change', this.handleScreenSizeChanged);
    }
  }

  private _listenMediaQueries() {
    for (const query of this.#mediaQueries) {
      query.addEventListener('change', this.handleScreenSizeChanged);
    }
  }

  private _initEditMode() {
    const removeEditModeOrDestroyed = merge(
      this.#destroyed$,
      this.#removeEditMode$
    );
    this.#dashboardItems.forEach(item => {
      if (!item.editable) item._initEditMode();
    });
    // Listen for changeSize event
    this.#orderedItems$
      .pipe(
        switchMap(items => {
          return merge(...items.map(item => item.changedSize));
        })
      )
      .pipe(takeUntil(removeEditModeOrDestroyed))
      .subscribe(event => {
        const dashboardItem = event.target;
        switch (event.phase) {
          case 'startResizing': {
            this.#targetPosition = dashboardItem.rect.getPosition();
            dashboardItem.stamp = true;
            // this._showPlaceholderElement(dashboardItem.rect.getPosition());
            break;
          }
          case 'resizing': {
            const resizingPosition: GridItemPosition = this._calculateNewPosition(
              this.#targetPosition,
              event
            );
            this._showPlaceholderElement(resizingPosition);
            this._fit(resizingPosition);
            break;
          }
          case 'endResizing': {
            dashboardItem.stamp = false;
            const resizingPosition: GridItemPosition = this._calculateNewPosition(
              this.#targetPosition,
              event
            );

            dashboardItem.rect = new Rect(resizingPosition);
            this._removePlaceholderElement();
            this.#styler.setPosition(
              dashboardItem,
              dashboardItem.rect.getPosition(),
              false
            );
            this._sortItemsByPosition();
            const columnOffset =
              resizingPosition.columnEnd -
              resizingPosition.columnStart -
              (this.#targetPosition.columnEnd -
                this.#targetPosition.columnStart);
            dashboardItem.updateScreenColumns(
              columnOffset,
              this.#currentScreenSize
            );
            dashboardItem.updateRows(
              resizingPosition.rowEnd - resizingPosition.rowStart
            );
            this._dispatchChangeEvent();
            break;
          }
          case 'startDragging': {
            this.#targetPosition = dashboardItem.rect.getPosition();
            dashboardItem.stamp = true;
            // this._showPlaceholderElement(dashboardItem.rect.getPosition());
            this._updateShiftTargets(dashboardItem.rect);
            break;
          }
          case 'dragging': {
            const movingPosition: GridItemPosition = this._calculateNewPosition(
              this.#targetPosition,
              event
            );
            this._shift(
              dashboardItem,
              movingPosition.columnStart,
              movingPosition.rowStart
            );
            this._showPlaceholderElement(dashboardItem.rect.getPosition());
            this._fit(dashboardItem.rect.getPosition());
            break;
          }
          case 'endDragging': {
            dashboardItem.stamp = false;
            this._removePlaceholderElement();
            this.#styler.setPosition(
              dashboardItem,
              dashboardItem.rect.getPosition(),
              false
            );
            this._sortItemsByPosition();
            this._dispatchChangeEvent();
            break;
          }
        }
      });
  }

  private _removeEditMode() {
    this.#dashboardItems.forEach(item => {
      item._removeEditMode();
    });
    this.#removeEditMode$.next();
    this.stopScrollingProcess();
  }

  private _calculateNewPosition(
    oldPosition: GridItemPosition,
    offset: PosistionOffset
  ): GridItemPosition {
    return {
      columnStart:
        oldPosition.columnStart +
        this._getSpanFloor(offset.left, this.#gridColumnWidth),
      rowStart:
        oldPosition.rowStart +
        this._getSpanFloor(offset.top, this.#gridRowHeight),
      columnEnd: Math.min(
        oldPosition.columnEnd +
          this._getSpan(offset.width, this.#gridColumnWidth),
        this.cols
      ),
      rowEnd:
        oldPosition.rowEnd + this._getSpan(offset.height, this.#gridRowHeight),
    };
  }

  private _getSpan(size: number, baseSize: number) {
    return Math.floor(
      (size + this.gutterSize + baseSize / 2) / (baseSize + this.gutterSize)
    );
  }

  private _getSpanFloor(size: number, baseSize: number) {
    return Math.floor((size + this.gutterSize) / (baseSize + this.gutterSize));
  }

  private _fit(position: GridItemPosition) {
    this.#gridCoordinator.reset();
    this.#gridCoordinator.placed(new Rect(position));
    this._shiftLayout();
  }

  private _updateShiftTargets(itemRect: Rect) {
    this.#shiftTargetKeys = [];
    this.#shiftTargets = [];
    const boundsSize = this.cols - itemRect.width;

    // add targets on top
    for (let i = 0; i < this.cols; i++) {
      this._addShiftTarget(i, 0, boundsSize);
    }

    // pack items to get theirs position.
    for (const contentItem of this.#dashboardItems) {
      const rect = contentItem.rect;
      this._addShiftTarget(rect.x, rect.y, boundsSize);
      this._addShiftTarget(rect.x, rect.y + rect.height, boundsSize);

      this._addShiftTarget(contentItem.rect.x, contentItem.rect.y, boundsSize);
      for (let i = 1; i < contentItem.rect.width; i++) {
        this._addShiftTarget(rect.x + i, rect.y + rect.height, boundsSize);
      }
    }
  }

  private _addShiftTarget(
    columnStart: number,
    rowStart: number,
    boundsSize: number
  ) {
    if (columnStart > boundsSize) {
      return;
    }
    // create string for a key, easier to keep track of what targets
    const key = columnStart + ',' + rowStart;
    const hasKey = this.#shiftTargetKeys.indexOf(key) !== -1;
    if (hasKey) {
      return;
    }
    this.#shiftTargetKeys.push(key);
    this.#shiftTargets.push({ x: columnStart, y: rowStart });
  }

  private _shift(item: DashboardItem, columnStart: number, rowStart: number) {
    let shiftPosition: Point | null = null;
    let minDistance = Infinity;
    const position = { x: columnStart, y: rowStart };
    for (const target of this.#shiftTargets) {
      const distance = getDistance(target, position);
      if (distance < minDistance) {
        shiftPosition = target;
        minDistance = distance;
      }
    }
    if (shiftPosition) {
      item.rect.x = shiftPosition.x;
      item.rect.y = shiftPosition.y;
    }
  }

  /**
   * Layout items, maintaining theirs column posisition
   */
  private _shiftLayout() {
    for (const contentItem of this.#dashboardItems) {
      if (!contentItem.stamp) {
        const rect = contentItem.rect;
        contentItem.rect = this.#gridCoordinator.columnPack(rect);
      }
    }
    this._layoutItems();
  }

  private _layoutItems(firstLayout = false) {
    for (const contentItem of this.#dashboardItems) {
      if (!contentItem.stamp) {
        this.#styler.setPosition(
          contentItem,
          contentItem.rect.getPosition(),
          firstLayout
        );
      }
    }
  }

  private _sortItemsByPosition() {
    this.#dashboardItems.sort((a, b) => {
      return a.rect.y - b.rect.y || a.rect.x - b.rect.x;
    });

    this.#dashboardItems.forEach((item, index) => {
      item.updateOrder(index);
    });
  }

  private _showPlaceholderElement(position: GridItemPosition) {
    this.#styler.setPosition(
      this.placeHolder!,
      position,
      !this.#isPlacehoderVisible
    );
    if (!this.#isPlacehoderVisible) {
      this.placeHolder.style.opacity = '1';
      this.#isPlacehoderVisible = true;
    }
  }

  private _removePlaceholderElement() {
    this.placeHolder.style.opacity = '0';
    this.#isPlacehoderVisible = false;
  }

  // ---------------------
  // support scrollon editing
  // ---------------------
  /**
   * Called by one item has started drawing.
   */
  startScrollingProcess(item: DashboardItem) {
    this.#activeItem = item;
    this.#scrollDirection = 'NONE';
    // this._cacheDimension();
    //this.#gridRowHeight =  this.#gridColumnWidth * this.#rowHeightRatio;
    this._cacheScrollPosition();
    this._listenToScrollEvents();
  }

  private _cacheDimension() {
    this.#elementRect = getMutableClientRect(this);
    this.#gridColumnWidth =
      (this.#elementRect.width - (this.cols - 1) * this.gutterSize) / this.cols;
    this.#gridRowHeight = getRowHeight(this.#currentScreenSize);
  }

  /**
   * Called by one item has stop drawing
   */
  stopScrollingProcess() {
    this.#activeItem = undefined;
    this.stopScrolling();
    this.#viewportScrollSubscription.unsubscribe();
  }

  /** Stops any currently-running auto-scroll sequences. */
  stopScrolling() {
    this.#stopScrollTimers.next();
  }

  startScrollingIfNecessary(pointerY: number, event: PosistionOffset) {
    const top = Math.max(
      this.#scrollNodeRect!.top + this.paddingTop,
      this.#elementRect.top
    );
    const scrollTop = this.#scrollPosition.top;
    this.#scrollDirection = 'NONE';
    if (pointerY < top && scrollTop > 0) {
      this.#scrollDirection = 'UP';
    } else if (pointerY > this.#scrollNodeRect!.bottom - this.paddingBottom) {
      this.#scrollDirection = 'DOWN';
    }

    if (this.#scrollDirection !== 'NONE') {
      this._startScrollInterval();
    } else {
      this.stopScrolling();
    }
  }

  private _listenToScrollEvents() {
    this.#viewportScrollSubscription = this.layoutService.scroll.subscribe(
      event => {
        const target = event.target as HTMLElement | Document;
        let newTop = 0;
        let newLeft = 0;
        if (target === document) {
          const viewportScrollPosition = getViewportScrollPosition();
          newTop = viewportScrollPosition.top;
          newLeft = viewportScrollPosition.left;
        } else if (target === this.#scrollNode) {
          newTop = (target as HTMLElement).scrollTop;
          newLeft = (target as HTMLElement).scrollLeft;
        }

        const topDifference = this.#scrollPosition.top - newTop;
        const leftDifference = this.#scrollPosition.left - newLeft;
        adjustClientRect(this.#elementRect, topDifference, leftDifference);
        this.#activeItem!.itemRef._pickupPositionOnPage.y =
          this.#activeItem!.itemRef._pickupPositionOnPage.y + topDifference;

        this.#scrollPosition.top = newTop;
        this.#scrollPosition.left = newLeft;
      }
    );
  }

  private _cacheScrollPosition() {
    if (this.scrollableParentSelector === 'viewport') {
      this.#scrollNode = window;
      const { width, height } = getViewportSize();
      const clientRect = {
        width,
        height,
        top: 0,
        right: width,
        bottom: height,
        left: 0,
      };
      this.#scrollNodeRect = clientRect;
      this.#scrollPosition = getViewportScrollPosition();
    } else {
      this.#scrollNode = this.scrollableParentSelector
        ? document.querySelector<HTMLElement>(this.scrollableParentSelector)
        : this;

      this.#scrollNodeRect = this.#scrollNode!.getBoundingClientRect();
      this.#scrollPosition = {
        top: this.#scrollNode!.scrollTop,
        left: this.#scrollNode!.scrollLeft,
      };
    }
  }

  /** Starts the interval that'll auto-scroll the element. */
  private _startScrollInterval = () => {
    this.stopScrolling();
    // interval(0, animationFrameScheduler)
    this.layoutService.scroll
      .pipe(
        startWith(''),
        throttleTime(0, animationFrameScheduler),
        takeUntil(this.#stopScrollTimers)
      )
      .subscribe({
        next: () => {
          const node = this.#scrollNode;
          if (this.#scrollDirection === 'UP') {
            this.layoutService.incrementScroll.next(-AUTO_SCROLL_STEP);
            incrementVerticalScroll(node!, -AUTO_SCROLL_STEP);
          } else if (this.#scrollDirection === 'DOWN') {
            this.layoutService.incrementScroll.next(AUTO_SCROLL_STEP);
            incrementVerticalScroll(node!, AUTO_SCROLL_STEP);
          }
        },
      });
  };

  private _dispatchChangeEvent() {
    const layoutItems: LayoutItems = [];
    this.#dashboardItems.forEach((item, index) => {
      layoutItems.push({
        id: item.id || index,
        cols: item.cols,
        rows: item.rows,
        screenColumns: item.screenColumn,
        order: item.order,
      });
    });

    const event = new CustomEvent('layout-change', {
      detail: layoutItems,
    });
    this.dispatchEvent(event);
  }
}
