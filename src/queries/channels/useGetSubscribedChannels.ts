import { Channel } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryKey } from "@tanstack/react-query";
import { CHANNEL_QUERY_KEY } from "./useGetChannel";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNELS_QUERY_KEY } from "./useGetChannels";

export const SUBSCRIBED_CHANNELS_QUERY_KEY = (): QueryKey => [
  ...CHANNELS_QUERY_KEY(),
  "SUBSCRIBED",
];

export interface GetSubscribedChannelsParams extends InfiniteQueryParams {}

export const GetSubscribedChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetSubscribedChannelsParams): Promise<ConnectedXMResponse<Channel[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/channels/subscribed`, {
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
      (channelId) => CHANNEL_QUERY_KEY(channelId),
      locale
    );
  }

  return data;
};

export const useGetSubscribedChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscribedChannels>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscribedChannels>>
  >(
    SUBSCRIBED_CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSubscribedChannels({ ...params }),
    params,
    options
  );
};
