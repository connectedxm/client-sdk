import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CHANNEL_QUERY_KEY } from "../useGetChannel";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CHANNEL_CONTENTS_QUERY_KEY = (
  channelId: string,
  type?: "video" | "audio" | "article",
  featured?: boolean,
  past?: boolean,
  includeDrafts?: boolean
): QueryKey => {
  const key = [...CHANNEL_QUERY_KEY(channelId), "CONTENTS"];
  if (featured) key.push("FEATURED");
  if (typeof past !== "undefined") key.push(past ? "PAST" : "UPCOMING");
  if (type) key.push(type);
  if (typeof includeDrafts !== "undefined")
    key.push(includeDrafts ? "INCLUDE_DRAFTS" : "EXCLUDE_DRAFTS");

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
  type?: "video" | "audio" | "article";
  featured?: boolean;
  past?: boolean;
  includeDrafts?: boolean;
}

export const GetChannelContents = async ({
  channelId,
  type,
  featured,
  past,
  includeDrafts,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelContentsParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/channels/${channelId}/contents`, {
    params: {
      type: type || undefined,
      featured: featured || undefined,
      past: past,
      includeDrafts:
        typeof includeDrafts !== "undefined"
          ? includeDrafts === true
            ? "true"
            : "false"
          : undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetChannelContents = (
  channelId: string = "",
  type?: "video" | "audio" | "article",
  featured?: boolean,
  past?: boolean,
  includeDrafts?: boolean,
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
    CHANNEL_CONTENTS_QUERY_KEY(channelId, type, featured, past, includeDrafts),
    (params: InfiniteQueryParams) =>
      GetChannelContents({
        ...params,
        channelId: channelId || "",
        type,
        featured,
        past,
        includeDrafts,
      }),
    params,
    {
      ...options,
      enabled: !!channelId && (options?.enabled ?? true),
    }
  );
};
