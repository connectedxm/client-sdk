import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_COLLECTION_QUERY_KEY } from "./useGetChannelCollection";
import { CHANNEL_CONTENT_QUERY_KEY } from "../content";

export const CHANNEL_COLLECTION_CONTENTS_QUERY_KEY = (
  channelId: string,
  collectionId: string
): QueryKey => [
  ...CHANNEL_COLLECTION_QUERY_KEY(channelId, collectionId),
  "CONTENTS",
];

export interface GetChannelCollectionContentsParams
  extends InfiniteQueryParams {
  channelId: string;
  collectionId: string;
}

export const GetChannelCollectionContents = async ({
  channelId,
  collectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetChannelCollectionContentsParams): Promise<
  ConnectedXMResponse<Content[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/collections/${collectionId}/contents`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
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

export const useGetChannelCollectionContents = (
  channelId: string,
  collectionId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelCollectionContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelCollectionContents>>
  >(
    CHANNEL_COLLECTION_CONTENTS_QUERY_KEY(channelId, collectionId),
    (params: InfiniteQueryParams) =>
      GetChannelCollectionContents({ channelId, collectionId, ...params }),
    params,
    options
  );
};
