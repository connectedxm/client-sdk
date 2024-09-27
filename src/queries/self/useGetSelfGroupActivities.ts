import type { Activity, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_GROUP_ACTIVITIES_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "GROUP_ACTIVITIES",
];

export interface GetSelfGroupActivitiesProps extends InfiniteQueryParams {}

export const GetSelfGroupActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfGroupActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/groups/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfGroupActivities = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfGroupActivities>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfGroupActivities>>
  >(
    SELF_GROUP_ACTIVITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfGroupActivities({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
