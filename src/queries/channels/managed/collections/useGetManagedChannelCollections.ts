import { ChannelCollection } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { MANAGED_CHANNEL_QUERY_KEY } from "../useGetManagedChannel";
import { MANAGED_CHANNEL_COLLECTION_QUERY_KEY } from "./useGetManagedChannelCollection";

export const MANAGED_CHANNEL_COLLECTIONS_QUERY_KEY = (
  channelId: string
): QueryKey => [...MANAGED_CHANNEL_QUERY_KEY(channelId), "COLLECTIONS"];

export const SET_MANAGED_CHANNEL_COLLECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MANAGED_CHANNEL_COLLECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetManagedChannelCollections>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MANAGED_CHANNEL_COLLECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetManagedChannelCollectionsParams
  extends InfiniteQueryParams {
  channelId: string;
}

export const GetManagedChannelCollections = async ({
  channelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetManagedChannelCollectionsParams): Promise<
  ConnectedXMResponse<ChannelCollection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/collections`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );return data;
};

export const useGetManagedChannelCollections = (
  channelId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelCollections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelCollections>>
  >(
    MANAGED_CHANNEL_COLLECTIONS_QUERY_KEY(channelId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelCollections({ channelId, ...params }),
    params,
    { ...options, enabled: !!channelId && (options?.enabled ?? true) }
  );
};
