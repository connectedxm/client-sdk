import { Channel } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
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
  clientApiParams,
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
