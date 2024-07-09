import { Content, ContentType } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CHANNEL_QUERY_KEY } from "../useGetChannel";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";

export const CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string,
  type?: keyof typeof ContentType
): QueryKey => {
  const key = [...CHANNEL_QUERY_KEY(channelId), "CONTENTS"];
  if (type) key.push(type);
  return key;
};

export const SET_CHANNEL_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CHANNEL_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CHANNEL_CONTENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetChannelContentsParams extends InfiniteQueryParams {
  channelId: string;
  type?: keyof typeof ContentType;
}

export const GetChannelContents = async ({
  channelId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetChannelContentsParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}/contents`, {
    params: {
      type: type || undefined,
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
      (contentId) => CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
      locale
    );
  }

  return data;
};

export const useGetChannelContents = (
  channelId: string = "",
  type?: keyof typeof ContentType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContents>>
  >(
    CHANNEL_CONTENTS_QUERY_KEY(channelId, type),
    (params: InfiniteQueryParams) =>
      GetChannelContents({ ...params, channelId: channelId || "", type }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
