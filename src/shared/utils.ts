import { ScreenSize } from './screen-size';
import { ScreenColumns } from './models';

export const CELL_SIZE = 8;

export const activeCapturingEventOptions = {
  passive: false,
  capture: true,
};

export const passiveEventListenerOptions = {
  passive: true,
};

/** Options that can be used to bind an active event listener. */
export const activeEventListenerOptions = {
  passive: false,
};

export const DEFAULT_CONFIG = {
  dragStartThreshold: 5,
  pointerDirectionChangeThreshold: 5,
};

export const AUTO_SCROLL_STEP = 2;

export const MIN_SIZE = 16;
/**
 * Time in milliseconds for which to ignore mouse events, after
 * receiving a touch event. Used to avoid doing double work for
 * touch devices where the browser fires fake mouse events, in
 * addition to touch events.
 */
export const MOUSE_EVENT_IGNORE_TIME = 800;

export interface MouseConfig {
  /**
   * Minimum amount of pixels that the user should
   * drag, before the CDK initiates a drag sequence.
   */
  dragStartThreshold: number;

  /**
   * Amount the pixels the user should drag before the CDK
   * considers them to have changed the drag direction.
   */
  pointerDirectionChangeThreshold: number;
}

export interface Point {
  x: number;
  y: number;
}
export const screenSizeOrder: ScreenSize[] = [
  ScreenSize.XSmall,
  ScreenSize.Small,
  ScreenSize.Medium,
  ScreenSize.Large,
];
export const screenColumnConfig: {
  [breakPoint in keyof typeof ScreenSize]: number;
} = {
  XSmall: 1,
  Small: 6,
  Medium: 9,
  Large: 12,
};

export const screenRowHeightConfig: {
  [breakPoint in keyof typeof ScreenSize]: number;
} = {
  XSmall: 3,
  Small: 4,
  Medium: 6,
  Large: 8,
};

export const screenBreakpoints: {
  [breakPoint in keyof typeof ScreenSize]: string;
} = {
  XSmall: '(max-width: 599.99px)',
  Small: '(min-width: 600px) and (max-width: 959.99px)',
  Medium: '(min-width: 960px) and (max-width: 1279.99px)',
  Large: '(min-width: 1280px)',
};

export function getRowHeight(screenSize: ScreenSize): number {
  return screenRowHeightConfig[screenSize];
}

export function updateScreenColumns(
  columnOffset: number,
  screenSize: ScreenSize,
  screenColumns: ScreenColumns
): ScreenColumns {
  const updatedScreenColumns = { ...screenColumns };
  updatedScreenColumns[screenSize] =
    updatedScreenColumns[screenSize] + columnOffset;
  const screenOrderIndex = screenSizeOrder.indexOf(screenSize);

  // get the value nearest the current screen column value.
  for (let i = 0; i < screenOrderIndex; i++) {
    const breakPoint = screenSizeOrder[i];
    let newSize = updatedScreenColumns[breakPoint]! + columnOffset;
    newSize = newSize < 1 ? 1 : newSize;
    updatedScreenColumns[breakPoint] = Math.max(
      Math.min(newSize, screenColumnConfig[breakPoint]),
      Math.min(updatedScreenColumns[screenSize], screenColumnConfig[breakPoint])
    );
  }

  for (let i = screenOrderIndex + 1; i < screenSizeOrder.length; i++) {
    const breakPoint = screenSizeOrder[i];
    updatedScreenColumns[breakPoint] =
      updatedScreenColumns[breakPoint] + columnOffset;
  }

  return updatedScreenColumns;
}

export function initScreenColumns(cols: number): ScreenColumns {
  const result: any = {};
  for (const screenSize of Object.keys(ScreenSize)) {
    const breakPoint = screenSize as ScreenSize;
    result[breakPoint] = Math.min(screenColumnConfig[breakPoint], cols);
  }
  return result as ScreenColumns;
}

export function snapToCell(currentSize: number) {
  return Math.round(currentSize / CELL_SIZE) * CELL_SIZE;
}

export function getTransform(x: number, y: number, snap = false): string {
  // Round the transforms since some browsers will
  // blur the elements for sub-pixel transforms.
  return snap
    ? `translate3d(${snapToCell(x)}px, ${snapToCell(y)}px, 0)`
    : `translate3d(${x}px, ${y}px, 0)`;
}

export function getPixel(value: number): string {
  if (value < 0) {
    value = 0;
  }
  return `${value}px`;
}

export function getPixelValue(value: string): number {
  if (value.endsWith('px')) {
    return parseInt(value.substr(0, value.length - 2), 0);
  }
  if (value.endsWith('%')) {
    return parseInt(value.substr(0, value.length - 1), 0);
  }
  return 0;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Helper type that ignores `readonly` properties. This is used in
// `extendStyles` to ignore the readonly properties on CSSStyleDeclaration
// since we won't be touching those anyway.
type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

/**
 * Extended CSSStyleDeclaration that includes a couple of drag-related
 * properties that aren't in the built-in TS typings.
 */
interface DragCSSStyleDeclaration extends CSSStyleDeclaration {
  webkitUserDrag: string;
  MozUserSelect: string; // For some reason the Firefox property is in PascalCase.
}

/**
 * Shallow-extends a stylesheet object with another stylesheet object.
 * @docs-private
 */
export function extendStyles(
  dest: Writeable<CSSStyleDeclaration>,
  source: Partial<DragCSSStyleDeclaration>
) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      dest[key] = source[key]!;
    }
  }

  return dest;
}

/** Determines whether an event is a touch event. */
export function isTouchEvent(
  event: MouseEvent | TouchEvent
): event is TouchEvent {
  // This function is called for every pixel that the user has dragged so we need it to be
  // as fast as possible. Since we only bind mouse events and touch events, we can assume
  // that if the event's name starts with `t`, it's a touch event.
  return event.type[0] === 't';
}

export interface MouseDownEvent {
  source: any;
  pointerPosition: { x: number; y: number };
  pickupPositionOnPage: Point;
  cancelled: boolean;
}

export interface MouseMoveEvent {
  source: any;
  pointerPosition: Point;
  pickupPositionOnPage: Point;
  pointerPositionAtLastDirectionChange: Point;
  distance: Point;
  hasMoved: boolean;
  delta: { x: -1 | 0 | 1; y: -1 | 0 | 1 };
  isScrolling: boolean;
}

/** Clamps a value between a minimum and a maximum. */
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function showElement(element: HTMLElement) {
  element.style.visibility = 'visible';
}

export function hideElement(element: HTMLElement) {
  element.style.visibility = 'hidden';
}

// export function calcLayout(element: HTMLElement): ItemLayout {
//   const clientRect = element.getBoundingClientRect();
//   return {
//     width: clientRect.width,
//     height: clientRect.height,
//     top: clientRect.top,
//     left: clientRect.left
//   };
// }

export function getElementDataAction(element: HTMLElement): string {
  return element.dataset.action || '';
}

export function getElementDataActionDelay(element: HTMLElement): boolean {
  return !!element.dataset.actionDelay || false;
}

// export function isPointerNearClientRect(
//   rect: ClientRect,
//   paddingTop: number,
//   paddingBottom: number,
//   pointerY: number
// ): boolean {
//   const top = Math.max(rect.top, paddingTop);
//   const bottom = Math.max(rect.bottom, paddingTop);
//   return pointerY < top - threshold || pointerY > top + height + threshold;
// }

export function incrementVerticalScroll(
  node: HTMLElement | Window,
  amount: number
) {
  if (node === window) {
    (node as Window).scrollBy(0, amount);
  } else {
    // Ideally we could use `Element.scrollBy` here as well, but IE and Edge don't support it.
    (node as HTMLElement).scrollTop += amount;
  }
}

export function getMutableClientRect(element: Element): ClientRect {
  const clientRect = element.getBoundingClientRect();

  // We need to clone the `clientRect` here, because all the values on it are readonly
  // and we need to be able to update them. Also we can't use a spread here, because
  // the values on a `ClientRect` aren't own properties. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect#Notes
  return {
    top: clientRect.top,
    right: clientRect.right,
    bottom: clientRect.bottom,
    left: clientRect.left,
    width: clientRect.width,
    height: clientRect.height,
  };
}

export function adjustClientRect(
  clientRect: ClientRect,
  top: number,
  left: number
) {
  clientRect.top += top;
  clientRect.bottom = clientRect.top + clientRect.height;

  clientRect.left += left;
  clientRect.right = clientRect.left + clientRect.width;
}

export interface ScrollPosition {
  top: number;
  left: number;
}

/** Gets the (top, left) scroll position of the viewport. */
export function getViewportScrollPosition(): ScrollPosition {
  // The top-left-corner of the viewport is determined by the scroll position of the document
  // body, normally just (scrollLeft, scrollTop). However, Chrome and Firefox disagree about
  // whether `document.body` or `document.documentElement` is the scrolled element, so reading
  // `scrollTop` and `scrollLeft` is inconsistent. However, using the bounding rect of
  // `document.documentElement` works consistently, where the `top` and `left` values will
  // equal negative the scroll position.
  const documentElement = document.documentElement!;
  const documentRect = documentElement.getBoundingClientRect();

  const top =
    -documentRect.top ||
    document.body.scrollTop ||
    window.scrollY ||
    documentElement.scrollTop ||
    0;

  const left =
    -documentRect.left ||
    document.body.scrollLeft ||
    window.scrollX ||
    documentElement.scrollLeft ||
    0;

  return { top, left };
}

export function getViewportSize(): Readonly<{ width: number; height: number }> {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function getDistance(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calc(exp: string): string {
  return `calc(${exp})`;
}

export function uuidPart(): string {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export function generateUUID(): string {
  return 'ss-s-s-s-sss'.replace(/s/g, uuidPart);
}
