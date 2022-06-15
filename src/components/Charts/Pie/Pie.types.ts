import { ReactNode } from 'react';

export interface IPieItem {
  name: string;
  value: number;
  color: string;
}

export enum PieTypes {
  'PIE',
  'DOUGHNUT',
}

export interface IPie {
  values: IPieItem[];
  size: number;
  type: PieTypes;
  width?: number;
  centeredElement?: HTMLElement | ReactNode;
}
