import { DashboardItem } from '../components/dashboard-item/dashboard-item.component';
import { ScreenSize } from './screen-size';

export interface LayoutItem {
  id: string | number;
  cols: number;
  rows: number;
  order: number;
  screenColumns: ScreenColumns;
}

export type LayoutItems = LayoutItem[];

export interface GridDefinition {
  cols: number;
  gutter: number;
  rowHeight: number | string;
}
export type ScreenColumns = {
  [breakPoint in keyof typeof ScreenSize]: number;
};

export const defaultGridDefinition = {
  cols: 12,
  rowHeight: '1:1',
  gutter: 8,
};

export interface GridItemSize {
  columnStart?: number;
  cols: number;
  rows: number;
}

export interface GridItemPosition {
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
}

export interface PosistionOffset {
  target: DashboardItem;
  top: number;
  left: number;
  width: number;
  height: number;
  phase?:
    | 'startResizing'
    | 'resizing'
    | 'startDragging'
    | 'dragging'
    | 'endDragging'
    | 'endResizing';
}
