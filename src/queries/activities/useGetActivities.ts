import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity } from "@interfaces";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
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
  locale,
}: GetActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);

  const { data } = await clientApi.get(`/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetActivities = () => {
  const queryClient = useQueryClient();
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetActivities>>>(
    ACTIVITIES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetActivities(params),
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

export default useGetActivities;
