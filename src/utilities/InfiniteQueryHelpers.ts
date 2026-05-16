import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import { produce } from "immer";
import { ConnectedXMResponse } from "@src/interfaces";

// For prepending an item to the first page of an infinite list, use the
// existing `AppendInfiniteQuery` helper — its name is a misnomer but its
// behaviour (`unshift` onto the first page) is what we want.

type Identified = { id: string | number };

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
