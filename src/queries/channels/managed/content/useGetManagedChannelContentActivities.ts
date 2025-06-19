import { Activity } from "@interfaces";
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
import {
  ACTIVITIES_QUERY_KEY,
  ACTIVITY_QUERY_KEY,
} from "@src/queries/activities";
import { MANAGED_CHANNEL_CONTENT_QUERY_KEY } from "./useGetManagedChannelContent";

export const MANAGED_CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY = (
  channelId: string,
  contentId: string
): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  ...MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
];

export const SET_MANAGED_CONTENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MANAGED_CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetManagedChannelContentActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...MANAGED_CHANNEL_CONTENT_ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

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
  queryClient,
  clientApiParams,
  locale,
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
  );return data;
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
