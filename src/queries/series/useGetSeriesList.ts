import type { ConnectedXMResponse, Series } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SERIES_LIST_QUERY_KEY = (): QueryKey => ["SERIES"];

export const SET_SERIES_LIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_LIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesList>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SERIES_LIST_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSeriesListProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSeriesList = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSeriesListProps): Promise<ConnectedXMResponse<Series[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/series`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSeriesList = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSeriesList>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesList>>>(
    SERIES_LIST_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSeriesList({ ...params }),
    params,
    options
  );
};
