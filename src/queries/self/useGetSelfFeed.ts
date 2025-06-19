import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, Activity } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_FEED_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "FEED",
];

export interface GetSelfFeedProps extends InfiniteQueryParams {}

export const GetSelfFeed = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSelfFeedProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/feed`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSelfFeed = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfFeed>>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfFeed>>>(
    SELF_FEED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfFeed(params),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
