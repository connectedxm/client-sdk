import { QueryClient, QueryKey } from "@tanstack/react-query";
import { produce } from "immer";
import { ConnectedXMResponse } from "@src/interfaces";

export const update = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  updater: (draft: TData) => void | TData
) => {
  queryClient.setQueryData(
    key,
    (oldData: ConnectedXMResponse<TData> | undefined) => {
      if (!oldData) return oldData;
      return produce(oldData, (draft) => {
        if (draft?.data) {
          const next = updater(draft.data as TData);
          if (next !== undefined) {
            draft.data = next as any;
          }
        }
      });
    }
  );
};

export const remove = (queryClient: QueryClient, key: QueryKey) => {
  queryClient.removeQueries({ queryKey: key });
};
