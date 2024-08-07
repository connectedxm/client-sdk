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

export const THREAD_EVENTS_QUERY_KEY = (
  threadId: string,
  accountId?: string
): QueryKey => [...THREADS_QUERY_KEY(), "events", threadId, accountId];

export const SET_THREAD_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_EVENTS_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThreadEvents>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_EVENTS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadEventsProps extends SingleQueryParams {
  threadId: string;
}

export const GetThreadEvents = async ({
  threadId,
  clientApiParams,
}: GetThreadEventsProps): Promise<ConnectedXMResponse<Thread[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/events`);
  return data;
};

export const useGetThreadEvents = (
  threadId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadEvents>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadEvents>>(
    THREAD_EVENTS_QUERY_KEY(threadId),
    (params) => GetThreadEvents({ threadId, ...params }),
    {
      ...options,
      enabled: !!threadId && (options?.enabled ?? true),
    }
  );
};
