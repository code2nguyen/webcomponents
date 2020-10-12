import {
  html,
  css,
  LitElement,
  property,
  TemplateResult,
  customElement,
  PropertyValues,
} from 'lit-element';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../shared/layout-service';
import { PosistionOffset, ScreenColumns } from '../../shared/models';
import { Rect } from '../../shared/rect';
import {
  extendStyles,
  getElementDataAction,
  getPixel,
  MouseDownEvent,
  MouseMoveEvent,
  Point,
  updateScreenColumns,
  initScreenColumns,
} from '../../shared/utils';
import { ScreenSize } from '../../shared/screen-size';
import { DashboardItemRef } from './dashboard-item-ref';
import { DashboardLayout } from '../dashboard-layout/dashboard-layout.component';
import isEqual from 'lodash-es/isEqual';

const EmptyRect = new Rect({
  columnStart: 0,
  rowStart: 0,
  columnEnd: 0,
  rowEnd: 0,
});
@customElement('cff-dashboard-item')
export class DashboardItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      overflow: hidden;
      border-radius: 4px;
      border: 1px solid
        rgba(var(--dashboard-theme-item-border-color, 255, 255, 255), 0.3);
      background-color: var(--dashboard-theme-item-bg-color-0, #303236);
      border-color: rgba(
        var(--dashboard-theme-item-border-color, 255, 255, 255),
        0.2
      );
      transition: background-color 0.5s ease-in-out, opacity 0.3s, left 0.3s,
        margin-top 0.3s, width 0.3s, padding-top 0.3s;
    }
    /* :host(:not(.moving)) {

    } */
    :host(.moving) {
      z-index: 100;
      transition: none;
    }

    .dashboard-item-content {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      height: 100%;
      padding: 0;
      margin: 0;
      flex-direction: column;
    }
    .dashboard-item-content-wrapper {
      display: flex;
      flex: 1;
      overflow: hidden;
      margin-bottom: 32px;
    }

    .dashboard-item-toolbar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 32px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      z-index: 1;
      transition: opacity 0.5s ease-in-out;
      align-self: stretch;
    }

    .dashboard-item-content:hover .dashboard-item-toolbar {
      opacity: 1;
    }
    .dashboard-item-toolbar .dashboard-item-toolbar-icon {
      color: rgba(var(--dashboard-theme-item-icon-color, 255, 255, 255), 0.5);
      padding: 0px 8px;
      cursor: pointer;
      transition: color 0.3s ease-out 0s;
      align-self: stretch;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dashboard-item-toolbar .dashboard-item-toolbar-icon:hover {
      color: rgb(var(--dashboard-theme-item-icon-color, 255, 255, 255));
    }

    .dashboard-item-toolbar .dashboard-item-resize-handle {
      cursor: se-resize;
    }

    .dashboard-item-toolbar .dashboard-item-drag-handle {
      cursor: move;
    }
    .dashboard-item-toolbar .dashboard-item-toolbar-separator {
      width: 16px;
    }

    :host(.bg-0) {
      background-color: var(--dashboard-theme-item-bg-color-0, #303236);
      border-color: rgba(
        var(--dashboard-theme-item-border-color, 255, 255, 255),
        0.2
      );
    }
    :host(.bg-1) {
      background-color: var(--dashboard-theme-item-bg-color-1, #5f6368);
      border-color: transparent;
    }
    :host(.bg-2) {
      background-color: var(--dashboard-theme-item-bg-color-2, #5c2b29);
      border-color: transparent;
    }
    :host(.bg-3) {
      background-color: var(--dashboard-theme-item-bg-color-3, #614a19);
      border-color: transparent;
    }
    :host(.bg-4) {
      background-color: var(--dashboard-theme-item-bg-color-4, #635d19);
      border-color: transparent;
    }
    :host(.bg-5) {
      background-color: var(--dashboard-theme-item-bg-color-5, #345920);
      border-color: transparent;
    }
    :host(.bg-6) {
      background-color: var(--dashboard-theme-item-bg-color-6, #16504b);
      border-color: transparent;
    }
    :host(.bg-7) {
      background-color: var(--dashboard-theme-item-bg-color-7, #2d555e);
      border-color: transparent;
    }
    :host(.bg-8) {
      background-color: var(--dashboard-theme-item-bg-color-8, #1e3a5f);
      border-color: transparent;
    }
    :host(.bg-9) {
      background-color: var(--dashboard-theme-item-bg-color-9, #42275e);
      border-color: transparent;
    }
    :host(.bg-10) {
      background-color: var(--dashboard-theme-item-bg-color-10, #5b2245);
      border-color: transparent;
    }
    :host(.bg-11) {
      background-color: var(--dashboard-theme-item-bg-color-11, #442f19);
      border-color: transparent;
    }
    :host(.bg-12) {
      background-color: var(--dashboard-theme-item-bg-color-12, #3c3f43);
      border-color: transparent;
    }
  `;

  #cols = 3;
  @property({ type: Number })
  get cols(): number {
    return this.#cols;
  }
  set cols(value: number) {
    if (this.#cols === value) return;
    const oldValue = this.#cols;
    this.#cols = value;

    if (value) {
      this.#screenColumn = initScreenColumns(this.#cols);
    }
    this.requestUpdate('cols', oldValue);
  }

  #rows = 10;
  @property({ type: Number })
  public get rows() {
    return this.#rows;
  }
  public set rows(value) {
    if (value === this.#rows) return;
    const oldValue = this.#rows;
    this.#rows = value;
    this.requestUpdate('rows', oldValue);
  }

  #order = -1;
  @property({ type: Number })
  public get order() {
    return this.#order;
  }
  public set order(value) {
    if (this.#order === value) return;
    const oldValue = this.#order;
    this.#order = value;
    this.requestUpdate('order', oldValue);
  }

  #screenColumn: ScreenColumns = initScreenColumns(this.#cols);
  @property({ type: Object })
  get screenColumn(): ScreenColumns {
    return this.#screenColumn;
  }
  set screenColumn(value: ScreenColumns) {
    if (isEqual(value, this.#screenColumn)) return;
    const oldValue = { ...this.#screenColumn };
    if (!value && this.#cols) {
      this.#screenColumn = initScreenColumns(this.#cols);
    } else {
      this.#screenColumn = value;
    }
    this.requestUpdate('screenColumn', oldValue);
  }

  getCols(screenSize: ScreenSize): number {
    return this.#screenColumn![screenSize];
  }

  // Seeamless update from parent

  updateRows(value: number) {
    this.#rows = value;
  }

  updateOrder(value: number) {
    this.#order = value;
  }

  updateScreenColumns(columnOffset: number, screenSize: ScreenSize) {
    if (columnOffset == 0) return;
    this.#screenColumn = updateScreenColumns(
      columnOffset,
      screenSize,
      this.screenColumn!
    );
    this.#cols = this.screenColumn[ScreenSize.Large];
  }

  #currentBgColor = 0;
  @property({ type: Number })
  get currentBgColor() {
    return this.#currentBgColor;
  }
  set currentBgColor(value: number) {
    if (value !== this.currentBgColor) {
      const oldValue = this.#currentBgColor;
      this.classList.remove(`bg-${this.currentBgColor}`);
      this.#currentBgColor = value;
      this.classList.add(`bg-${this.currentBgColor}`);
      this.requestUpdate('currentBgColor', oldValue);
    }
  }

  rect: Rect = EmptyRect;
  stamp = false;
  #editable = false;
  public get editable() {
    return this.#editable;
  }
  public set editable(value) {
    if (value === this.#editable) return;
    const oldValue = this.#editable;
    this.#editable = value;
    this.requestUpdate('editable', oldValue);
  }
  changedSize = new Subject<PosistionOffset>();

  #itemRef!: DashboardItemRef;
  #stopMouseListener$ = new Subject<void>();
  #elementRect!: ClientRect;
  #marginTop = 0;
  #elementLeft = 0;
  #columnWidth = 1;
  #rowHeight = 0;
  #activeTransform: Point = { x: 0, y: 0 };
  #positionOffset: PosistionOffset = {
    target: this,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  };

  #nbrBackgroundColor = 13;

  #layoutService?: LayoutService;
  get layoutService(): LayoutService | undefined {
    if (!this.#layoutService) {
      const parent = this.parentElement as DashboardLayout;
      this.#layoutService = parent?.layoutService;
    }
    return this.#layoutService;
  }

  get itemRef() {
    return this.#itemRef;
  }

  connectedCallback() {
    super.connectedCallback();
    this.layoutService?.registerItem(this);
  }

  disconnectedCallback() {
    this.layoutService?.removeItem(this);
    this._removeEditMode();
    super.disconnectedCallback();
  }

  render(): TemplateResult {
    return html`
      <div class="dashboard-item-content">
        <div class="dashboard-item-toolbar">
          <!-- external toolbar slot -->
          <slot name="toolbar"></slot>
          <div class="dashboard-item-toolbar-separator"></div>

          ${this.editable
            ? html`
                <!-- move -->
                <div
                  class="scaler dashboard-item-toolbar-icon dashboard-item-drag-handle"
                  data-action="drag"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-move"
                  >
                    <polyline points="5 9 2 12 5 15"></polyline>
                    <polyline points="9 5 12 2 15 5"></polyline>
                    <polyline points="15 19 12 22 9 19"></polyline>
                    <polyline points="19 9 22 12 19 15"></polyline>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                  </svg>
                </div>

                <!-- resize -->
                <div
                  data-action="move-bottom-right"
                  class="scaler dashboard-item-toolbar-icon dashboard-item-resize-handle"
                >
                  <svg viewBox="0 0 6 6" x="0" y="0" width="6px" height="6px">
                    <g>
                      <path
                        d="M 6 6 L 0 6 L 0 4.2 L 4 4.2 L 4.2 4.2 L 4.2 0 L 6 0 L 6 6 L 6 6 Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                </div>
              `
            : ''}
        </div>
        <div class="dashboard-item-content-wrapper">
          <slot></slot>
        </div>
      </div>
    `;
  }

  updated(changedProperties: PropertyValues) {
    if (
      changedProperties.has('cols') ||
      changedProperties.has('screenColumn') ||
      changedProperties.has('order') ||
      changedProperties.has('rows')
    ) {
      if (
        changedProperties.has('cols') ||
        changedProperties.has('screenColumn') ||
        changedProperties.has('order')
      ) {
        this.rect = EmptyRect;
      }

      console.log('relayout me', changedProperties);
      this.layoutService?.layoutItem(this);
    }
  }

  _initEditMode() {
    if (this.editable) return;
    this.editable = true;
    this.#itemRef = new DashboardItemRef(this);
    this.#itemRef.pointerDown
      .pipe(takeUntil(this.#stopMouseListener$))
      .subscribe(event => {
        this._startDrawing(event);
      });

    this.#itemRef.pointerUp
      .pipe(takeUntil(this.#stopMouseListener$))
      .subscribe(event => {
        this._endDrawing(event);
      });

    this.#itemRef.pointerMove
      .pipe(takeUntil(this.#stopMouseListener$))
      .subscribe(event => {
        this._drawing(event);
      });
  }

  _removeEditMode() {
    if (!this.editable) return;
    this.editable = false;
    this.#stopMouseListener$.next();
    this.#stopMouseListener$.complete();
    this.#itemRef.dispose();
  }

  private _startDrawing(event: MouseDownEvent) {
    if (event.cancelled) {
      return;
    }
    this.#elementRect = this.getBoundingClientRect();
    this.#columnWidth =
      this.layoutService?.layoutContainer.gridColumnWidth || 1;
    this.#rowHeight = this.layoutService?.layoutContainer.gridRowHeight || 1;
    this.#positionOffset = {
      target: this,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    };
    this.layoutService?.layoutContainer.startScrollingProcess(this);
    const action = getElementDataAction(event.source);
    if (action === 'drag') {
      this._toggleDragStyles(true, this);
      const styles = window.getComputedStyle(this);
      this.#marginTop = parseInt(styles.marginTop, 10);
      this.#elementLeft = parseInt(styles.left, 10);
    }
    this.changedSize.next({
      ...this.#positionOffset,
      phase: action === 'drag' ? 'startDragging' : 'startResizing',
    });
    this.classList.add('moving');
  }

  private _endDrawing(event: MouseMoveEvent) {
    const action = getElementDataAction(event.source);
    if (action === 'drag') {
      this._toggleDragStyles(false, this);
    }
    // if (event.hasMoved) {
    this.changedSize.next({
      ...this.#positionOffset,
      phase: action === 'drag' ? 'endDragging' : 'endResizing',
    });
    // }

    this.layoutService?.layoutContainer.stopScrollingProcess();
    this.classList.remove('moving');
  }

  private _drawing(event: MouseMoveEvent) {
    const action = getElementDataAction(event.source);
    switch (action) {
      case 'drag': {
        this._draging(event);
        break;
      }
      case 'move-bottom-right': {
        const x = event.distance.x;
        const y = event.distance.y;
        const height = Math.max(this.#elementRect.height + y, this.#rowHeight);
        const boundaryRect = this.layoutService?.layoutContainer.elementRect;
        let width = Math.max(this.#elementRect.width + x, this.#columnWidth);
        if (width + this.#elementRect.left > boundaryRect!.right - 1) {
          width = boundaryRect!.right - this.#elementRect.left - 1;
        }

        this.style.paddingTop = getPixel(height);
        this.style.width = getPixel(width);
        this.#positionOffset.height = height - this.#elementRect.height;
        this.#positionOffset.width = width - this.#elementRect.width;
        const changeSizeEvent: PosistionOffset = {
          ...this.#positionOffset,
          phase: 'resizing',
        };
        this.changedSize.next(changeSizeEvent);
        if (!event.isScrolling) {
          this._updateContainer(event.pointerPosition.y, changeSizeEvent);
        }
        break;
      }
    }
  }

  private _draging(event: MouseMoveEvent) {
    const activeTransform = this.#activeTransform;
    activeTransform.x = event.pointerPosition.x - event.pickupPositionOnPage.x;
    activeTransform.y = event.pointerPosition.y - event.pickupPositionOnPage.y;
    this._validateTransform(activeTransform);

    this._applyRootElementTransform(activeTransform.x, activeTransform.y);
    this.#positionOffset.left = activeTransform.x;
    this.#positionOffset.top = activeTransform.y;
    const changeSizeEvent: PosistionOffset = {
      ...this.#positionOffset,
      phase: 'dragging',
    };
    this.changedSize.next(changeSizeEvent);
    if (!event.isScrolling) {
      this._updateContainer(event.pointerPosition.y, changeSizeEvent);
    }
  }

  private _updateContainer(pointerY: number, event: PosistionOffset) {
    this.layoutService?.layoutContainer.startScrollingIfNecessary(
      pointerY,
      event
    );
  }

  private _toggleDragStyles(enable: boolean, element?: HTMLElement) {
    if (!element) {
      return;
    }
    const userSelect = enable ? '' : 'none';

    extendStyles(element.style, {
      touchAction: enable ? '' : 'none',
      webkitUserDrag: enable ? '' : 'none',
      webkitTapHighlightColor: enable ? '' : 'transparent',
      userSelect,
      cursor: enable ? 'move' : '',
    });
    if (enable) {
      element.classList.add('dragging');
    } else {
      element.classList.remove('dragging');
    }
  }

  changeBackgroundColorIndex = () => {
    this.classList.remove(`bg-${this.currentBgColor}`);
    this.currentBgColor = (this.currentBgColor + 1) % this.#nbrBackgroundColor;
    this.classList.add(`bg-${this.currentBgColor}`);
    this.dispatchEvent(
      new CustomEvent('change-background', {
        detail: this.currentBgColor,
      })
    );
  };

  getTargetHandle(mouseEventTargets: EventTarget[]): HTMLElement | null {
    const handles = this.shadowRoot?.querySelectorAll('.scaler');
    let targetHandle: HTMLElement | null = null;
    if (handles) {
      for (const target of mouseEventTargets.reverse()) {
        handles.forEach(item => {
          if (item === target) {
            targetHandle = target as HTMLElement;
          }
        });
        if (targetHandle) {
          break;
        }
      }
      return targetHandle;
    }
    return this;
  }

  private _validateTransform(activeTransform: Point) {
    const boundaryRect = this.layoutService?.layoutContainer.elementRect;
    if (activeTransform.x + this.#elementRect.left < boundaryRect!.left) {
      activeTransform.x = boundaryRect!.left - this.#elementRect.left;
    }

    if (
      activeTransform.x + this.#elementRect.left + this.#elementRect.width >
      boundaryRect!.right - 1
    ) {
      activeTransform.x =
        boundaryRect!.right -
        this.#elementRect.left -
        this.#elementRect.width -
        1;
    }
  }

  private _applyRootElementTransform(x: number, y: number, snap = false) {
    this.style.marginTop = getPixel(this.#marginTop + y);
    this.style.left = getPixel(this.#elementLeft + x);
  }
}
