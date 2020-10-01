import { Subject, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  activeEventListenerOptions,
  DEFAULT_CONFIG,
  getViewportScrollPosition,
  isTouchEvent,
  MouseDownEvent,
  MouseMoveEvent,
  MOUSE_EVENT_IGNORE_TIME,
  passiveEventListenerOptions,
  Point,
} from '../../shared/utils';
import { DashboardItem } from './dashboard-item.component';

export class DashboardItemRef {
  pointerDown = new Subject<MouseDownEvent>();
  pointerUp = new Subject<MouseMoveEvent>();
  pointerMove = new Subject<MouseMoveEvent>();

  /** Cached scroll position on the page when the element was picked up. */
  #scrollPosition: { top: number; left: number } = { top: 0, left: 0 };
  #pointerMoveSubscription = Subscription.EMPTY;
  #pointerUpSubscription = Subscription.EMPTY;
  #scrollSubscription = Subscription.EMPTY;
  #hasStartedDrawing = false;
  #lastTouchEventTime?: number;
  #hasMoved = false;

  /** Coordinates on the page at which the user picked up the element. */
  _pickupPositionOnPage: Point = { x: 0, y: 0 };

  /** Keeps track of the direction in which the user is dragging along each axis. */
  #pointerDirectionDelta: { x: -1 | 0 | 1; y: -1 | 0 | 1 } = {
    x: 0,
    y: 0,
  };

  /** Pointer position at which the last change in the delta occurred. */
  #pointerPositionAtLastDirectionChange: Point = { x: 0, y: 0 };

  /** Time at which the last dragging sequence was started. */
  #drawStartTime = 0;

  /**
   * Amount of milliseconds to wait after the user has put their
   * pointer down before starting to drag the element.
   */
  #dragStartDelay = 0;
  #lockAxis: 'x' | 'y' | undefined;
  #currentActionTarget?: HTMLElement;
  #mouseDetectionActionConfig = DEFAULT_CONFIG;

  constructor(private element: DashboardItem) {
    this.element.addEventListener(
      'mousedown',
      this._pointerDown,
      activeEventListenerOptions
    );
    this.element.addEventListener(
      'touchstart',
      this._pointerDown,
      passiveEventListenerOptions
    );
  }

  dispose() {
    this._removeSubscriptions();
    this.element.removeEventListener('mousedown', this._pointerDown, {
      capture: true,
    });
    this.element.removeEventListener('touchstart', this._pointerDown, {
      capture: true,
    });
    this.#currentActionTarget = undefined;
  }

  private _pointerDown = (event: MouseEvent | TouchEvent) => {
    const targetHandler = this.element.getTargetHandle(event.composedPath());
    if (!targetHandler) return;
    this._initializeDrawSequence(targetHandler, event);
  };

  private _initializeDrawSequence(
    referenceElement: HTMLElement,
    event: MouseEvent | TouchEvent
  ) {
    // Always stop propagation for the event that initializes
    // the dragging sequence, in order to prevent it from potentially
    // starting another sequence for a draggable parent somewhere up the DOM tree.
    event.stopPropagation();

    const isDrawing = this.#hasStartedDrawing;
    const isTouchSequence = isTouchEvent(event);
    const isAuxiliaryMouseButton =
      !isTouchSequence && (event as MouseEvent).button !== 0;
    const isSyntheticEvent =
      !isTouchSequence &&
      this.#lastTouchEventTime &&
      this.#lastTouchEventTime + MOUSE_EVENT_IGNORE_TIME > Date.now();

    // If the event started from an element with the native HTML drag&drop, it'll interfere
    // with our own dragging (e.g. `img` tags do it by default). Prevent the default action
    // to stop it from happening. Note that preventing on `dragstart` also seems to work, but
    // it's flaky and it fails if the user drags it away quickly. Also note that we only want
    // to do this for `mousedown` since doing the same for `touchstart` will stop any `click`
    // events from firing on touch devices.
    if (
      event.target &&
      (event.target as HTMLElement).draggable &&
      event.type === 'mousedown'
    ) {
      event.preventDefault();
    }

    // Abort if the user is already dragging or is using a mouse button other than the primary one.
    if (isDrawing || isAuxiliaryMouseButton || isSyntheticEvent) {
      return;
    }

    this.#hasStartedDrawing = this.#hasMoved = false;

    // Avoid multiple subscriptions and memory leaks when multi touch
    // (isDragging check above isn't enough because of possible temporal and/or dimensional delays)
    this._removeSubscriptions();
    this.#pointerMoveSubscription = this.element.layoutService!.pointerMove.subscribe(
      this._pointerMove
    );
    this.#pointerUpSubscription = this.element.layoutService!.pointerUp.subscribe(
      this._pointerUp
    );
    this.#scrollSubscription = this.element
      .layoutService!.scroll.pipe(startWith(''))
      .subscribe(() => {
        this.#scrollPosition = getViewportScrollPosition();
      });

    // If we have a custom preview template, the element won't be visible anyway so we avoid the
    // extra `getBoundingClientRect` calls and just move the preview next to the cursor.
    const pointerPosition = (this._pickupPositionOnPage = this._getPointerPositionOnPage(
      event
    ));
    this.#pointerDirectionDelta = { x: 0, y: 0 };
    this.#pointerPositionAtLastDirectionChange = {
      x: pointerPosition.x,
      y: pointerPosition.y,
    };
    this.#drawStartTime = Date.now();
    this.element.layoutService!.startListener(this.element, event);
    this.#currentActionTarget = referenceElement;
    this.pointerDown.next({
      source: referenceElement,
      pickupPositionOnPage: this._pickupPositionOnPage,
      pointerPosition,
      cancelled: false,
    });
  }

  private _pointerMove = ({
    event,
    scroll,
  }: {
    event: MouseEvent | TouchEvent;
    scroll: number | null;
  }) => {
    const scrollY = scroll ?? 0;
    if (!this.#hasStartedDrawing) {
      const pointerPosition = this._getPointerPositionOnPage(event);
      const distanceX = Math.abs(
        pointerPosition.x - this._pickupPositionOnPage.x
      );
      const distanceY =
        Math.abs(pointerPosition.y - this._pickupPositionOnPage.y) + scrollY;
      const isOverThreshold =
        distanceX + distanceY >=
        this.#mouseDetectionActionConfig.dragStartThreshold;

      // Only start dragging after the user has moved more than the minimum distance in either
      // direction. Note that this is preferrable over doing something like `skip(minimumDistance)`
      // in the `pointerMove` subscription, because we're not guaranteed to have one move event
      // per pixel of movement (e.g. if the user moves their pointer quickly).
      if (isOverThreshold) {
        const isDelayElapsed =
          Date.now() >= this.#drawStartTime + (this.#dragStartDelay || 0);
        if (!isDelayElapsed) {
          this._endDrawSequence(event);
          return;
        }
        this.#hasStartedDrawing = true;
        if (isTouchEvent(event)) {
          this.#lastTouchEventTime = Date.now();
        }
      }

      return;
    }

    // this._pickupPositionOnPage.y = this._pickupPositionOnPage.y - scrollY;
    const constrainedPointerPosition = this._getConstrainedPointerPosition(
      event
    );
    this.#hasMoved = true;
    event.preventDefault();
    this._updatePointerDirectionDelta(constrainedPointerPosition);
    const mouseEvent = {
      source: this.#currentActionTarget,
      pickupPositionOnPage: this._pickupPositionOnPage,
      pointerPosition: constrainedPointerPosition,
      pointerPositionAtLastDirectionChange: this
        .#pointerPositionAtLastDirectionChange,
      hasMoved: this.#hasMoved,
      distance: this._getDrawDistance(constrainedPointerPosition),
      delta: this.#pointerDirectionDelta,
      isScrolling: !!scrollY,
    };
    mouseEvent.pointerPosition.y = mouseEvent.pointerPosition.y + scrollY;
    mouseEvent.distance.y = mouseEvent.distance.y + scrollY;
    this.pointerMove.next(mouseEvent);
  };

  private _pointerUp = (event: MouseEvent | TouchEvent) => {
    this._endDrawSequence(event);
  };

  private _removeSubscriptions() {
    this.#pointerMoveSubscription.unsubscribe();
    this.#pointerUpSubscription.unsubscribe();
    this.#scrollSubscription.unsubscribe();
  }

  /**
   * Clears subscriptions and stops the dragging sequence.
   * @param event Browser event object that ended the sequence.
   */
  private _endDrawSequence(event: MouseEvent | TouchEvent) {
    this.#drawStartTime = this.#lastTouchEventTime = 0;
    this._removeSubscriptions();
    this.element.layoutService!.stopListener(this.element);
    const constrainedPointerPosition = this._getConstrainedPointerPosition(
      event
    );
    this.pointerUp.next({
      source: this.#currentActionTarget,
      pointerPosition: constrainedPointerPosition,
      pickupPositionOnPage: this._pickupPositionOnPage,
      pointerPositionAtLastDirectionChange: this
        .#pointerPositionAtLastDirectionChange,
      hasMoved: this.#hasMoved,
      distance: this._getDrawDistance(constrainedPointerPosition),
      delta: this.#pointerDirectionDelta,
      isScrolling: false,
    });
    this.#hasMoved = this.#hasStartedDrawing = false;
  }

  /** Determines the point of the page that was touched by the user. */
  private _getPointerPositionOnPage(event: MouseEvent | TouchEvent): Point {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = isTouchEvent(event)
      ? event.touches[0] || event.changedTouches[0]
      : event;
    return {
      x: point.pageX - this.#scrollPosition.left,
      y: point.pageY - this.#scrollPosition.top,
    };
  }

  /** Gets the pointer position on the page, accounting for any position constraints. */
  private _getConstrainedPointerPosition(
    event: MouseEvent | TouchEvent
  ): Point {
    const point = this._getPointerPositionOnPage(event);
    const constrainedPoint = point;
    if (this.#lockAxis === 'x') {
      constrainedPoint.y = this._pickupPositionOnPage.y;
    } else if (this.#lockAxis === 'y') {
      constrainedPoint.x = this._pickupPositionOnPage.x;
    }

    return constrainedPoint;
  }

  /** Updates the current draw delta, based on the user's current pointer position on the page. */
  private _updatePointerDirectionDelta(pointerPositionOnPage: Point) {
    const { x, y } = pointerPositionOnPage;
    const delta = this.#pointerDirectionDelta;
    const positionSinceLastChange = this.#pointerPositionAtLastDirectionChange;

    // Amount of pixels the user has dragged since the last time the direction changed.
    const changeX = Math.abs(x - positionSinceLastChange.x);
    const changeY = Math.abs(y - positionSinceLastChange.y);

    // Because we handle pointer events on a per-pixel basis, we don't want the delta
    // to change for every pixel, otherwise anything that depends on it can look erratic.
    // To make the delta more consistent, we track how much the user has moved since the last
    // delta change and we only update it after it has reached a certain threshold.
    if (
      changeX > this.#mouseDetectionActionConfig.pointerDirectionChangeThreshold
    ) {
      delta.x = x > positionSinceLastChange.x ? 1 : -1;
      positionSinceLastChange.x = x;
    }

    if (
      changeY > this.#mouseDetectionActionConfig.pointerDirectionChangeThreshold
    ) {
      delta.y = y > positionSinceLastChange.y ? 1 : -1;
      positionSinceLastChange.y = y;
    }

    return delta;
  }

  private _getDrawDistance(currentPosition: Point): Point {
    const pickupPosition = this._pickupPositionOnPage;

    if (pickupPosition) {
      return {
        x: currentPosition.x - pickupPosition.x,
        y: currentPosition.y - pickupPosition.y,
      };
    }

    return { x: 0, y: 0 };
  }
}
