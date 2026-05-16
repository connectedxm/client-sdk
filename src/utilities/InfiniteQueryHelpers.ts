import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { produce } from "immer";
import { ConnectedXMResponse } from "@src/interfaces";

type Identified = { id: string | number };

/** Prepend an item to the first page of an infinite query. */
export const prepend = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  item: TData
) => {
  queryClient.setQueryData(
    key,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>> | undefined) => {
      if (!oldData) return oldData;
      return produce(oldData, (draft) => {
        if (draft?.pages?.[0]?.data) {
          draft.pages[0].data.unshift(item as any);
        }
      });
    }
  );
};

/** Replace an item by id wherever it appears across pages. */
export const update = <TData extends Identified>(
  queryClient: QueryClient,
  key: QueryKey,
  item: TData
) => {
  queryClient.setQueryData(
    key,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>> | undefined) => {
      if (!oldData) return oldData;
      return produce(oldData, (draft) => {
        for (const page of draft.pages) {
          if (page?.data) {
            const idx = page.data.findIndex(
              (entry: TData) => entry.id === item.id
            );
            if (idx !== -1) {
              page.data[idx] = item as any;
              return;
            }
          }
        }
      });
    }
  );
};

/** Remove an item by id wherever it appears across pages. */
export const remove = <TData extends Identified>(
  queryClient: QueryClient,
  key: QueryKey,
  itemId: TData["id"]
) => {
  queryClient.setQueryData(
    key,
    (oldData: InfiniteData<ConnectedXMResponse<TData[]>> | undefined) => {
      if (!oldData) return oldData;
      return produce(oldData, (draft) => {
        for (const page of draft.pages) {
          if (page?.data) {
            const idx = page.data.findIndex(
              (entry: TData) => entry.id === itemId
            );
            if (idx !== -1) {
              page.data.splice(idx, 1);
              return;
            }
          }
        }
      });
    }
  );
};
