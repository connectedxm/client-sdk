import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CONTENT_QUERY_KEY } from "@src/queries/contents";
import { MANAGED_CHANNEL_COLLECTION_QUERY_KEY } from "./useGetManagedChannelCollection";
import { MANAGED_CHANNEL_CONTENT_QUERY_KEY } from "../content";

export const MANAGED_CHANNEL_COLLECTION_CONTENTS_QUERY_KEY = (
  channelId: string,
  collectionId: string
): QueryKey => [
  ...MANAGED_CHANNEL_COLLECTION_QUERY_KEY(channelId, collectionId),
  "CONTENTS",
];

export interface GetManagedChannelCollectionContentsParams
  extends InfiniteQueryParams {
  channelId: string;
  collectionId: string;
}

export const GetManagedChannelCollectionContents = async ({
  channelId,
  collectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetManagedChannelCollectionContentsParams): Promise<
  ConnectedXMResponse<Content[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/collections/${collectionId}/contents`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  if (queryClient && data.status === "ok") {}

  return data;
};

export const useGetManagedChannelCollectionContents = (
  channelId: string,
  collectionId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelCollectionContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelCollectionContents>>
  >(
    MANAGED_CHANNEL_COLLECTION_CONTENTS_QUERY_KEY(channelId, collectionId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelCollectionContents({
        channelId,
        collectionId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && !!collectionId && (options?.enabled ?? true),
    }
  );
};
