import type { Activity, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "./useGetSelf";
import {
  ACTIVITY_QUERY_KEY,
  SET_ACTIVITY_QUERY_DATA,
} from "../activities/useGetActivity";
import { useConnectedXM } from "@src/hooks";

export const SELF_ACTIVITIES_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "ACTIVITIES",
];

interface GetSelfActivitiesProps extends InfiniteQueryParams {}

export const GetSelfActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
}: GetSelfActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const { data } = await clientApi.get(`/self/activities`, {
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
      SET_ACTIVITY_QUERY_DATA
    );
  }

  return data;
};

const useGetSelfActivities = (
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfActivities>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfActivities>>
  >(
    SELF_ACTIVITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfActivities({ ...params }),
    params,
    {
      ...options,
      enabled: !!token && (options.enabled ?? true),
    }
  );
};

export default useGetSelfActivities;
