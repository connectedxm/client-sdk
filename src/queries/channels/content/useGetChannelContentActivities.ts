import { Activity } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY } from "../../activities";
import { CHANNEL_CONTENT_QUERY_KEY } from "./useGetChannelContent";

export const CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  ...CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
];

export interface GetChannelContentActivitiesParams extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetChannelContentActivities = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetChannelContentActivitiesParams): Promise<
  ConnectedXMResponse<Activity[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/${channelId}/contents/${contentId}/activities`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  return data;
};

export const useGetChannelContentActivities = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetChannelContentActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetChannelContentActivities>>
  >(
    CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetChannelContentActivities({ channelId, contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
