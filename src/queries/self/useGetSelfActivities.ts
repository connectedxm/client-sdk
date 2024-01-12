import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { Activity } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useQueryClient } from "@tanstack/react-query";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SET_ACTIVITY_QUERY_DATA } from "../activities/useGetActivity";

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
  locale,
}: GetSelfActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSelfActivities = () => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfActivities>>
  >(
    SELF_ACTIVITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfActivities({ ...params }),
    {
      enabled: !!token,
      onSuccess: (data) => {
        CacheIndividualQueries(
          data,
          queryClient,
          (activityId) => [activityId],
          SET_ACTIVITY_QUERY_DATA
        );
      },
    }
  );
};

export default useGetSelfActivities;
