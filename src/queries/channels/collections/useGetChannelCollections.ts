import { ChannelCollection } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CHANNEL_QUERY_KEY } from "../useGetChannel";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_COLLECTION_QUERY_KEY } from "./useGetChannelCollection";

export const CHANNEL_COLLECTIONS_QUERY_KEY = (channelId: string): QueryKey => [
  ...CHANNEL_QUERY_KEY(channelId),
  "COLLECTIONS",
];

export const SET_CHANNEL_COLLECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_COLLECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelCollections>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNEL_COLLECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChannelCollectionsParams extends InfiniteQueryParams {
  channelId: string;
}

export const GetChannelCollections = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetChannelCollectionsParams): Promise<
  ConnectedXMResponse<ChannelCollection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}/collections`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });return data;
};

export const useGetChannelCollections = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelCollections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelCollections>>
  >(
    CHANNEL_COLLECTIONS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetChannelCollections({ channelId, ...params }),
    params,
    { ...options, enabled: !!channelId && (options?.enabled ?? true) }
  );
};
