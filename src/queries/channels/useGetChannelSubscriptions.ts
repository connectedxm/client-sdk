import { ChannelSubscription } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";

export const CHANNEL_SUBSCRIPTIONS_QUERY_KEY = (
  channelId: string
): QueryKey => [...CHANNEL_QUERY_KEY(channelId), "SUBSCRIPTIONS"];

export interface GetChannelSubscriptionsParams extends InfiniteQueryParams {
  channelId: string;
}

export const GetChannelSubscriptions = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelSubscriptionsParams): Promise<
  ConnectedXMResponse<ChannelSubscription[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}/subscriptions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetChannelSubscriptions = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelSubscriptions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelSubscriptions>>
  >(
    CHANNEL_SUBSCRIPTIONS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetChannelSubscriptions({ channelId, ...params }),
    params,
    options
  );
};
