import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import {
  QueryClient,
  SetDataOptions,
  QueryKey,
  Updater,
} from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadCircleAccount } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "./useGetThreadCircleAccounts";

export const THREAD_CIRCLE_ACCOUNT_QUERY_KEY = (
  circleId: string,
  accountId: string
): QueryKey => [...THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId), accountId];

export const SET_THREAD_CIRCLE_ACCOUNT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_ACCOUNT_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThreadCircleAccount>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_CIRCLE_ACCOUNT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadCircleAccountProps extends SingleQueryParams {
  circleId: string;
  accountId: string;
}

export const GetThreadCircleAccount = async ({
  circleId,
  accountId,
  clientApiParams,
}: GetThreadCircleAccountProps): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/threads/circles/${circleId}/accounts/${accountId}`
  );
  return data;
};

export const useGetThreadCircleAccount = (
  circleId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadCircleAccount>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadCircleAccount>>(
    THREAD_CIRCLE_ACCOUNT_QUERY_KEY(circleId, accountId),
    (params) => GetThreadCircleAccount({ circleId, accountId, ...params }),
    {
      ...options,
      enabled: !!circleId && !!accountId && (options?.enabled ?? true),
    }
  );
};
