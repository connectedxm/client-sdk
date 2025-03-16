import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY } from "../activities";

export const ACCOUNT_ACTIVITIES_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  ...ACCOUNT_QUERY_KEY(accountId),
];

export interface GetAccountActivitiesProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountActivities = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  clientApiParams,
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
