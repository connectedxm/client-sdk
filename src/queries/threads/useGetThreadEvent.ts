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

export const THREAD_EVENT_QUERY_KEY = (eventId: string): QueryKey => [
  ...THREADS_QUERY_KEY(),
  "event",
  eventId,
];

export const SET_THREAD_EVENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_EVENT_QUERY_KEY>,
  response: Updater<any, Awaited<ReturnType<typeof GetThreadEvent>>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_EVENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadEventProps {
  eventId: string;
  clientApiParams?: any;
}

export const GetThreadEvent = async ({
  eventId,
  clientApiParams,
}: GetThreadEventProps): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/events/${eventId}`);
  return data;
};

export const useGetThreadEvent = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadEvent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadEvent>>(
    THREAD_EVENT_QUERY_KEY(eventId),
    (params) => GetThreadEvent({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
