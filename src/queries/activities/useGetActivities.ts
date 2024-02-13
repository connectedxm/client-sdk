import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { SET_ACTIVITY_QUERY_DATA } from "./useGetActivity";
import { ConnectedXMResponse } from "@interfaces";

export const ACTIVITIES_QUERY_KEY = () => ["ACTIVITIES"];

export const SET_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetActivitiesProps extends InfiniteQueryParams {}

export const GetActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
}: GetActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const { data } = await clientApi.get(`/activities`, {
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
      (activityId) => [activityId],
      SET_ACTIVITY_QUERY_DATA
    );
  }

  return data;
};

export const useGetActivities = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetActivities>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetActivities>>(
    ACTIVITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetActivities(params),
    params,
    {
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
