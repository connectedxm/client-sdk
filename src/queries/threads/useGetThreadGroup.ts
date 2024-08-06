import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
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

export const THREAD_GROUP_QUERY_KEY = (
  groupId: string,
  accountId: string
): QueryKey => [...THREADS_QUERY_KEY(), "group", groupId, accountId];

export const SET_THREAD_GROUP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_GROUP_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThreadGroup>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_GROUP_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadGroupProps {
  groupId: string;
  accountId: string;
  clientApiParams?: any;
}

export const GetThreadGroup = async ({
  groupId,
  clientApiParams,
}: GetThreadGroupProps): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/groups/${groupId}`);
  return data;
};

export const useGetThreadGroup = (
  groupId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadGroup>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadGroup>>(
    THREAD_GROUP_QUERY_KEY(groupId, accountId),
    (params) => GetThreadGroup({ groupId, accountId, ...params }),
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
