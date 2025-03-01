import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Thread } from "@interfaces";
import {
  QueryClient,
  SetDataOptions,
  QueryKey,
  Updater,
} from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { PRIVATE_THREADS_QUERY_KEY } from "@src/queries";

export const THREAD_QUERY_KEY = (threadId: string): QueryKey => [
  ...PRIVATE_THREADS_QUERY_KEY(),
  threadId,
];

export const SET_THREAD_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThread>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [...THREAD_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response,
    options
  );
};

export interface GetThreadProps extends SingleQueryParams {
  threadId: string;
}

export const GetThread = async ({
  threadId,
  clientApiParams,
}: GetThreadProps): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}`);
  return data;
};

export const useGetThread = (
  threadId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThread>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThread>>(
    THREAD_QUERY_KEY(threadId),
    (params) => GetThread({ threadId, ...params }),
    {
      ...options,
      enabled: !!threadId && (options?.enabled ?? true),
    }
  );
};
