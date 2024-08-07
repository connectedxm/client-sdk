import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Thread } from "@interfaces";
import { THREADS_QUERY_KEY } from "./useGetThreads";
import {
  QueryClient,
  SetDataOptions,
  QueryKey,
  Updater,
} from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const THREAD_GROUPS_QUERY_KEY = (accountId?: string): QueryKey => [
  ...THREADS_QUERY_KEY(),
  "groups",
  accountId,
];

export const SET_THREAD_GROUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_GROUPS_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThreadGroups>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_GROUPS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadGroupsProps extends SingleQueryParams {}

export const GetThreadGroups = async ({
  clientApiParams,
}: GetThreadGroupsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/groups`);
  return data;
};

export const useGetThreadGroups = (
  options: SingleQueryOptions<ReturnType<typeof GetThreadGroups>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadGroups>>(
    THREAD_GROUPS_QUERY_KEY(),
    (params) => GetThreadGroups({ ...params }),
    {
      ...options,
      enabled: options?.enabled ?? true,
    }
  );
};
