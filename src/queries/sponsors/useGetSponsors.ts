import type { Account, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SPONSORS_QUERY_KEY = (): QueryKey => ["SPONSORS"];

export const SET_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSponsorsProps extends InfiniteQueryParams {}

export const GetSponsors = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSponsors = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSponsors>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSponsors>>>(
    SPONSORS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSponsors({ ...params }),
    params,
    options
  );
};
