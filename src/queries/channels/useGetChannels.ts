import { Channel } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CHANNELS_QUERY_KEY = (): QueryKey => ["CHANNELS"];

export interface GetChannelsParams extends InfiniteQueryParams {}

export const GetChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelsParams): Promise<ConnectedXMResponse<Channel[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetChannels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetChannels>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetChannels>>>(
    CHANNELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetChannels({ ...params }),
    params,
    options
  );
};
