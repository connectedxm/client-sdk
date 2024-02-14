import { ConnectedXMResponse } from "@interfaces";
import { GetBaseSingleQueryKeys } from "@src/queries/useConnectedSingleQuery";
import { QueryClient } from "@tanstack/react-query";

interface ItemWithId {
  id: string;
  alternateId?: number;
  slug?: string;
  username?: string;
  name?: string | null;
  code?: string;
}

export const CacheIndividualQueries = <TData extends ItemWithId>(
  page: ConnectedXMResponse<TData[]>,
  queryClient: QueryClient,
  queryKeyFn: (id: string) => string[],
  locale: string = "en",
  itemMap?: (item: TData) => TData
) => {
  page.data.forEach((item) => {
    item = itemMap ? itemMap(item) : item;

    if (item.id) {
      const SudoResponse: ConnectedXMResponse<TData> = {
        status: page.status,
        message: `Cached From: ${page.message}`,
        data: item,
      };

      // Query Client, keyparams, response
      queryClient.setQueryData(
        [...queryKeyFn(item.id), ...GetBaseSingleQueryKeys(locale)],
        SudoResponse
      );

      if (item.slug) {
        queryClient.setQueryData(
          [...queryKeyFn(item.slug), ...GetBaseSingleQueryKeys(locale)],
          SudoResponse
        );
      }
      if (item.username) {
        queryClient.setQueryData(
          [...queryKeyFn(item.username), ...GetBaseSingleQueryKeys(locale)],
          SudoResponse
        );
      }
      if (item.code) {
        queryClient.setQueryData(
          [...queryKeyFn(item.code), ...GetBaseSingleQueryKeys(locale)],
          SudoResponse
        );
      }
      if (item.name) {
        queryClient.setQueryData(
          [...queryKeyFn(item.name), ...GetBaseSingleQueryKeys(locale)],
          SudoResponse
        );
      }
      if (item.alternateId) {
        queryClient.setQueryData(
          [
            ...queryKeyFn(item.alternateId.toString()),
            ...GetBaseSingleQueryKeys(locale),
          ],
          SudoResponse
        );
      }
    }
  });
};
