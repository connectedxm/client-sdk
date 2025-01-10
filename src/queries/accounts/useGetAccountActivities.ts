import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY } from "../activities";

export const ACCOUNT_ACTIVITIES_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
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

export interface GetAccountActivitiesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  queryClient,
  clientApiParams,
  locale,
}: GetAccountActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/activities`, {
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

export const useGetAccountActivities = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountActivities>>
  >(
    ACCOUNT_ACTIVITIES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountActivities({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
