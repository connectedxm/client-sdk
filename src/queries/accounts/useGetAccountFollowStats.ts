import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

export const ACCOUNT_FOLLOW_STATS_QUERY_KEY = (accountId: string): QueryKey => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "FOLLOW_STATS",
];

export interface GetAccountFollowStatsProps extends SingleQueryParams {
  accountId: string;
}

export const GetAccountFollowStats = async ({
  accountId,
  clientApiParams,
}: GetAccountFollowStatsProps): Promise<
  ConnectedXMResponse<{
    following: number;
    followers: number;
  }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/accounts/${accountId}/followStats`);
  return data;
};

export const useGetAccountFollowStats = (
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountFollowStats>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountFollowStats>>(
    ACCOUNT_FOLLOW_STATS_QUERY_KEY(accountId),
    (_params) => GetAccountFollowStats({ accountId, ..._params }),
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
