import { Activity } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { CONTENT_QUERY_KEY } from "./useGetContent";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_ACTIVITIES_QUERY_KEY = (contentId: string): QueryKey => [
  "ACTIVITIES",
  ...CONTENT_QUERY_KEY(contentId),
];

export const SET_CONTENT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetContentParams extends InfiniteQueryParams {
  contentId: string;
}

export const GetContentActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentId,
  queryClient,
  clientApi,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<Activity[]>> => {
  const { data } = await clientApi.get(`/contents/${contentId}/activities`, {
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
      (activityId) => ACTIVITY_QUERY_KEY(activityId),
      locale
    );
  }

  return data;
};

export const useGetContentActivities = (
  contentId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetContentActivities>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentActivities>>
  >(
    CONTENT_ACTIVITIES_QUERY_KEY(contentId),
    (params: InfiniteQueryParams) =>
      GetContentActivities({ contentId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!contentId && (options.enabled ?? true),
    }
  );
};
