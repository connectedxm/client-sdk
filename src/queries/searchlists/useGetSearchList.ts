import type { SearchList } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const SEARCH_LIST_QUERY_KEY = (searchListId: string) => [
  "SEARCH_LISTS",
  searchListId,
];

export interface GetSearchListProps extends SingleQueryParams {
  searchListId: string;
}

export const GetSearchList = async ({
  searchListId,
  clientApiParams,
}: GetSearchListProps): Promise<ConnectedXMResponse<SearchList>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/searchlists/${searchListId}`);
  return data;
};

export const useGetSearchList = (
  searchListId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSearchList>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSearchList>>(
    SEARCH_LIST_QUERY_KEY(searchListId),
    (params: SingleQueryParams) =>
      GetSearchList({
        searchListId,
        ...params,
      }),
    {
      ...options,
      enabled: !!searchListId && (options?.enabled ?? true),
    }
  );
};
