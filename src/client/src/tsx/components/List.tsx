import React, { ReactElement, ReactNode } from "react";

import { ListProps, PropsBasicWithKey } from "./baseComponentsTypes";

/**
 *
 * @param param0 Props of List Component
 * @returns React Element
 * @description Generic List Component
 */

function List<T extends PropsBasicWithKey>({
  dataArray,
  LI,
  className,
}: ListProps<T>) {
  return (
    <ul className={className}>
      {dataArray.map((el) => (
        <LI {...el}></LI>
      ))}
    </ul>
  );
}

export default List;
