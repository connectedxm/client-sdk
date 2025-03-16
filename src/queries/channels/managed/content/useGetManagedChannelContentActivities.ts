import { Activity } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY } from "@src/queries/activities";
import { MANAGED_CHANNEL_CONTENT_QUERY_KEY } from "./useGetManagedChannelContent";

export const MANAGED_CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  ...MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
];

export interface GetManagedChannelContentActivitiesParams
  extends InfiniteQueryParams {
  channelId: string;
  contentId: string;
}

export const GetManagedChannelContentActivities = async ({
  channelId,
  contentId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetManagedChannelContentActivitiesParams): Promise<
  ConnectedXMResponse<Activity[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/channels/managed/${channelId}/contents/${contentId}/activities`,
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

export const useGetManagedChannelContentActivities = (
  channelId: string = "",
  contentId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetManagedChannelContentActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetManagedChannelContentActivities>>
  >(
    MANAGED_CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(channelId, contentId),
    (params: InfiniteQueryParams) =>
      GetManagedChannelContentActivities({ channelId, contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!channelId && !!contentId && (options?.enabled ?? true),
    }
  );
};
