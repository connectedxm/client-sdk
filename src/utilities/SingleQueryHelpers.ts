import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "..";
import { produce } from "immer";
import { GetBaseSingleQueryKeys } from "@src/queries/useConnectedSingleQuery";

/**
 * Sets the data for a single query
 * Use this to completely replace the data in a query
 * Handles the case where oldData is empty
 */
export const SetSingleQueryData = <TData>(
  queryClient: QueryClient,
  key: QueryKey,
  locale: string,
  newData: TData
) => {
  queryClient.setQueryData(
    [...key, ...GetBaseSingleQueryKeys(locale)] as QueryKey,
    (oldData: ConnectedXMResponse<TData> | undefined) => {
      // If oldData is undefined, create a new response object
      if (!oldData) {
        return {
          status: "ok",
          message: "",
          data: newData,
        } as ConnectedXMResponse<TData>;
      }

      // Otherwise, update the existing data
      return produce(oldData, (draft) => {
        if (draft) {
          draft.data = newData as any;
        }
      });
    }
  );
};

/**
 * Deletes a single query from the cache
 */
export const DeleteSingleQueryData = (
  queryClient: QueryClient,
  key: QueryKey,
  locale: string
) => {
  queryClient.removeQueries({
    queryKey: [...key, ...GetBaseSingleQueryKeys(locale)] as QueryKey,
  });
};
