import { Channel } from "@interfaces";
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

export const CHANNELS_QUERY_KEY = (): QueryKey => ["CHANNELS"];

export const SET_CHANNELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannels>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNELS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChannelsParams extends InfiniteQueryParams {}

export const GetChannels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
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
