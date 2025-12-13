import { ChannelSubscriber } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CHANNEL_SUBSCRIBERS_QUERY_KEY = (channelId: string): QueryKey => [
  "CHANNELS",
  channelId,
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
  clientApiParams,
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
