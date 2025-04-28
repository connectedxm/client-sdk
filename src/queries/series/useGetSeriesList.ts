import type { ConnectedXMResponse, Series } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SERIES_LIST_QUERY_KEY = (): QueryKey => ["SERIES"];

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
