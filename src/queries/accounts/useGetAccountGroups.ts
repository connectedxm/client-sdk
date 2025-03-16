import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Group } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_GROUPS_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "GROUPS",
];

export interface GetAccountGroupsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountGroups = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  clientApiParams,
}: GetAccountGroupsProps): Promise<ConnectedXMResponse<Group[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/groups`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetAccountGroups = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountGroups>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountGroups>>
  >(
    ACCOUNT_GROUPS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) => GetAccountGroups({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
