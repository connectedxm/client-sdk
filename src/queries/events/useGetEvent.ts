import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Event } from "@interfaces";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENTS_QUERY_KEY(),
  eventId,
];

export const SET_EVENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEvent>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...EVENT_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetEventProps extends SingleQueryParams {
  eventId: string;
}

export const GetEvent = async ({
  eventId,
  clientApiParams,
}: GetEventProps): Promise<ConnectedXMResponse<Event>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}`);
  return data;
};

export const useGetEvent = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEvent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEvent>>(
    EVENT_QUERY_KEY(eventId),
    (params) => GetEvent({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
