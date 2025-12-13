import type { SearchList } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const SEARCH_LISTS_QUERY_KEY = () => ["SEARCH_LISTS"];

export interface GetSearchListsProps extends InfiniteQueryParams {}

export const GetSearchLists = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSearchListsProps): Promise<ConnectedXMResponse<SearchList[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get("/searchlists", {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSearchLists = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSearchLists>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSearchLists>>>(
    SEARCH_LISTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSearchLists(params),
    params,
    options
  );
};
