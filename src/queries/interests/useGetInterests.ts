import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { Interest } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const INTERESTS_QUERY_KEY = (): QueryKey => ["INTERESTS"];

export const SET_INTERESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof INTERESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetInterests>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...INTERESTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetInterestsProps extends InfiniteQueryParams {}

export const GetInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetInterests = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetInterests>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInterests>>>(
    INTERESTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetInterests(params),
    params,
    {
      ...options,
    }
  );
};
