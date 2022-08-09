import { ThHTMLAttributes } from "react";

export interface PropsBasic {
  className?: string;
  children?: React.ReactNode;
}

export interface PropsBasicWithKey extends PropsBasic {
  key: string;
}

export type ComponentProps<T extends PropsBasicWithKey> = {
  [p in keyof T]: T[p];
};

export interface ComponentWithArray<T extends { key: string }>
  extends PropsBasic {
  dataArray: T[];
}

export interface ListProps<T extends { key: string }>
  extends ComponentWithArray<T> {
  LI: (props: ComponentProps<T>) => JSX.Element;
}
export type ExcludeKey<T> = Exclude<keyof T, "key">;

export interface TableProps<T extends { key: string }>
  extends ComponentWithArray<T> {
  Th: (props: { value: ExcludeKey<T> }) => JSX.Element;
  Td: (props: { value: string | number }) => JSX.Element;
}
