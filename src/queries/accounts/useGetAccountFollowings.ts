import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACCOUNT_FOLLOWINGS_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOWINGS",
];

export interface GetAccountFollowingsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountFollowings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  accountId,
  clientApiParams,
}: GetAccountFollowingsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/following`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetAccountFollowings = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountFollowings>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountFollowings>>
  >(
    ACCOUNT_FOLLOWINGS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountFollowings({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
