import type { SearchListValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SEARCH_LIST_QUERY_KEY } from "./useGetSearchList";

export const SEARCH_LIST_VALUES_QUERY_KEY = (searchListId: string) => [
  ...SEARCH_LIST_QUERY_KEY(searchListId),
  "VALUES",
];

export interface GetSearchListValuesProps extends InfiniteQueryParams {
  searchListId: string;
}

export const GetSearchListValues = async ({
  searchListId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSearchListValuesProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/searchlists/${searchListId}/values`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSearchListValues = (
  searchListId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSearchListValues>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSearchListValues>>
  >(
    SEARCH_LIST_VALUES_QUERY_KEY(searchListId),
    (queryParams: InfiniteQueryParams) =>
      GetSearchListValues({
        searchListId,
        ...params,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled: !!searchListId && (options?.enabled ?? true),
    }
  );
};
