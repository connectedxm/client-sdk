import { ConnectedXMResponse } from "@interfaces";
import { InfiniteData } from "@tanstack/react-query";

export function MergeInfinitePages<TData>(
  data: InfiniteData<ConnectedXMResponse<TData[]>>
) {
  return data.pages.reduce(
    (items: TData[], page: ConnectedXMResponse<TData[]>) => {
      return [...items, ...page.data];
    },
    []
  );
}
