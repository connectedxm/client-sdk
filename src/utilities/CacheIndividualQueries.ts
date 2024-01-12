import { ConnectedXMResponse } from "@interfaces";
import { QueryClient, InfiniteData } from "@tanstack/react-query";

interface ItemWithId {
  id: string;
  alternateId?: number;
  slug?: string;
  username?: string;
  name?: string | null;
  code?: string;
}

const CacheIndividualQueries = <TData extends ItemWithId>(
  response: InfiniteData<ConnectedXMResponse<TData[]>>,
  queryClient: QueryClient,
  queryKeyFn: (id: string) => any,
  SET_FUNCTION: (
    client: QueryClient,
    keyParams: any,
    response: ConnectedXMResponse<TData>
  ) => void,
  itemMap?: (item: TData) => TData
) => {
  response.pages.forEach((page) => {
    page.data.forEach((item) => {
      item = itemMap ? itemMap(item) : item;

      if (item.id) {
        const SudoResponse: ConnectedXMResponse<TData> = {
          status: page.status,
          message: `Cached From: ${page.message}`,
          data: item,
        };

        // Query Client, keyparams, response
        SET_FUNCTION(queryClient, queryKeyFn(item.id), SudoResponse);

        if (item.slug) {
          SET_FUNCTION(queryClient, queryKeyFn(item.slug), SudoResponse);
        }
        if (item.username) {
          SET_FUNCTION(queryClient, queryKeyFn(item.username), SudoResponse);
        }
        if (item.code) {
          SET_FUNCTION(queryClient, queryKeyFn(item.code), SudoResponse);
        }
        if (item.name) {
          SET_FUNCTION(queryClient, queryKeyFn(item.name), SudoResponse);
        }
        if (item.alternateId) {
          SET_FUNCTION(
            queryClient,
            queryKeyFn(item.alternateId.toString()),
            SudoResponse
          );
        }
      }
    });
  });
};

export default CacheIndividualQueries;
