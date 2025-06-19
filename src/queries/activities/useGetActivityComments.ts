import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ACTIVITY_QUERY_KEY } from "./useGetActivity";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACTIVITY_COMMENTS_QUERY_KEY = (activityId: string): QueryKey => [
  ...ACTIVITY_QUERY_KEY(activityId),
  "ACTIVITY_COMMENTS",
];

export const SET_ACTIVITY_COMMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITY_COMMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivityComments>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACTIVITY_COMMENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetActivityCommentsProps extends InfiniteQueryParams {
  activityId: string;
}

export const GetActivityComments = async ({
  activityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetActivityCommentsProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/activities/${activityId}/comments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetActivityComments = (
  activityId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetActivityComments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetActivityComments>>
  >(
    ACTIVITY_COMMENTS_QUERY_KEY(activityId),
    (params: InfiniteQueryParams) =>
      GetActivityComments({ activityId, ...params }),
    params,
    {
      enabled: !!activityId && (options?.enabled ?? true),
    }
  );
};
