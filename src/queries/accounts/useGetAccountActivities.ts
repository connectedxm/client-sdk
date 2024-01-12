import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { QueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { SET_ACTIVITY_QUERY_DATA } from "../activities/useGetActivity";

export const ACCOUNT_ACTIVITIES_QUERY_KEY = (accountId: string) => [
  "ACTIVITIES",
  ...ACCOUNT_QUERY_KEY(accountId),
];

export const SET_ACCOUNT_ACTIVITIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_ACTIVITIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountActivities>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ACCOUNT_ACTIVITIES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetAccountActivitiesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  locale,
  queryClient,
}: GetAccountActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/accounts/${accountId}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient) {
    CacheIndividualQueries(
      data,
      queryClient,
      (activityId) => [activityId],
      SET_ACTIVITY_QUERY_DATA
    );
  }

  return data;
};

const useGetAccountActivities = (
  accountId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetAccountActivities>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetAccountActivities>>(
    ACCOUNT_ACTIVITIES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountActivities({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!accountId,
    }
  );
};

export default useGetAccountActivities;
