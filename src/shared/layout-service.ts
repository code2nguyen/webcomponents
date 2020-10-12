import {
  animationFrameScheduler,
  merge,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { withLatestFrom, map, tap, throttleTime } from 'rxjs/operators';
import { DashboardItem } from '../components/dashboard-item/dashboard-item.component';
import { DashboardLayout } from '../components/dashboard-layout/dashboard-layout.component';
import { activeCapturingEventOptions } from './utils';

export class LayoutService {
  #itemsSubject = new ReplaySubject<DashboardItem[]>(1);
  #items = new Set<DashboardItem>();
  #activateItems = new Set<DashboardItem>();

  layoutContainer: DashboardLayout;

  /** Keeps track of the event listeners that we've bound to the `document`. */
  #globalListeners = new Map<
    string,
    {
      handler: (event: Event) => void;
      options?: AddEventListenerOptions | boolean;
    }
  >();

  readonly incrementScroll = new Subject<number>();

  readonly #pointerMove: Subject<TouchEvent | MouseEvent> = new Subject<
    TouchEvent | MouseEvent
  >();

  readonly pointerMove: Observable<{
    event: TouchEvent | MouseEvent;
    scroll: number;
  }> = merge(
    this.incrementScroll.pipe(
      withLatestFrom(this.#pointerMove),
      map(([scroll, event]) => {
        return { event, scroll };
      })
    ),
    this.#pointerMove.pipe(
      tap(() => {
        this.layoutContainer.stopScrolling();
      }),
      map(event => ({ event, scroll: 0 }))
    )
  );

  readonly pointerUp: Subject<TouchEvent | MouseEvent> = new Subject<
    TouchEvent | MouseEvent
  >();

  readonly scroll: Subject<Event> = new Subject<Event>();

  get items$() {
    return this.#itemsSubject.pipe(
      throttleTime(0, animationFrameScheduler, {
        leading: false,
        trailing: true,
      })
    );
  }

  constructor(dashboardLayout: DashboardLayout) {
    this.layoutContainer = dashboardLayout;
  }

  registerItem(item: DashboardItem) {
    this.#items.add(item);
    this.#itemsSubject.next(this.__getOrderedItems());
  }

  layoutItem(item: DashboardItem) {
    if (!this.#items.has(item)) {
      this.registerItem(item);
    } else {
      this.#itemsSubject.next(this.__getOrderedItems());
    }
  }

  __getOrderedItems() {
    return Array.from(this.#items)
      .map((item, index) => {
        item.order = item.order === undefined ? index : item.order;
        return item;
      })
      .sort((itemA, itemB) => itemA.order! - itemB.order!);
  }

  removeItem(item: DashboardItem): void {
    this.#items.delete(item);
    this.stopListener(item);
    this.#itemsSubject.next(this.__getOrderedItems());
  }

  startListener(item: DashboardItem, event: TouchEvent | MouseEvent) {
    // Do not process the same drag twice to avoid memory leaks and redundant listeners
    if (this.#activateItems.has(item)) {
      return;
    }

    this.#activateItems.add(item);

    if (this.#activateItems.size === 1) {
      // The `touchmove` event gets bound once, ahead of time, because WebKit
      // won't preventDefault on a dynamically-added `touchmove` listener.
      // See https://bugs.webkit.org/show_bug.cgi?id=184250.
      document.addEventListener(
        'touchmove',
        this.__preventDefaultWhileDragging,
        activeCapturingEventOptions
      );
      const isTouchEvent = event.type.startsWith('touch');
      const moveEvent = isTouchEvent ? 'touchmove' : 'mousemove';
      const upEvent = isTouchEvent ? 'touchend' : 'mouseup';

      // We explicitly bind __active__ listeners here, because newer browsers will default to
      // passive ones for `mousemove` and `touchmove`. The events need to be active, because we
      // use `preventDefault` to prevent the page from scrolling while the user is dragging.
      this.#globalListeners
        .set(moveEvent, {
          handler: (e: Event) => {
            this.#pointerMove.next(e as TouchEvent | MouseEvent);
          },
          options: activeCapturingEventOptions,
        })
        .set(upEvent, {
          handler: (e: Event) =>
            this.pointerUp.next(e as TouchEvent | MouseEvent),
          options: true,
        })
        .set('scroll', {
          handler: (e: Event) => this.scroll.next(e),
          // Use capturing so that we pick up scroll changes in any scrollable nodes that aren't
          // the document. See https://github.com/angular/components/issues/17144.
          options: true,
        })
        // Preventing the default action on `mousemove` isn't enough to disable text selection
        // on Safari so we need to prevent the selection event as well. Alternatively this can
        // be done by setting `user-select: none` on the `body`, however it has causes a style
        // recalculation which can be expensive on pages with a lot of elements.
        .set('selectstart', {
          handler: this.__preventDefaultWhileDragging,
          options: activeCapturingEventOptions,
        });

      this.#globalListeners.forEach((config, name) => {
        document.addEventListener(name, config.handler, config.options);
      });
    }
  }

  stopListener(item: DashboardItem) {
    this.#activateItems.delete(item);
    if (this.#activateItems.size === 0) {
      this.__clearGlobalListeners();
    }
  }

  isListening(item: DashboardItem) {
    return this.#activateItems.has(item);
  }

  destroy() {
    this.#items.forEach(instance => this.stopListener(instance));
    this.__clearGlobalListeners();
    this.#items.clear();
    this.#activateItems.clear();
    this.#pointerMove.complete();
    this.pointerUp.complete();
  }

  __preventDefaultWhileDragging = (event: Event) => {
    if (this.#activateItems.size) {
      event.preventDefault();
    }
  };

  __clearGlobalListeners() {
    this.#globalListeners.forEach((config, name) => {
      document.removeEventListener(name, config.handler, config.options);
    });

    document.removeEventListener(
      'touchmove',
      this.__preventDefaultWhileDragging,
      activeCapturingEventOptions
    );

    this.#globalListeners.clear();
  }
}
