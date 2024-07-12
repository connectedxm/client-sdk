import { ChannelSubscriber } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "./contents";

export const CHANNEL_SUBSCRIBERS_QUERY_KEY = (channelId: string): QueryKey => [
  ...CHANNEL_QUERY_KEY(channelId),
  "SUBSCRIBERS",
];

export const SET_CHANNEL_SUBSCRIBERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_SUBSCRIBERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelSubscribers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNEL_SUBSCRIBERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChannelSubscribersParams extends InfiniteQueryParams {
  channelId: string;
}

export const GetChannelSubscribers = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  channelId,
  queryClient,
  clientApiParams,
  locale,
}: GetChannelSubscribersParams): Promise<
  ConnectedXMResponse<ChannelSubscriber[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}/subscribers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (contentId) => CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
      locale
    );
  }

  return data;
};

export const useGetChannelSubscribers = (
  channelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelSubscribers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelSubscribers>>
  >(
    CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetChannelSubscribers({ ...params, channelId: channelId || "" }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
