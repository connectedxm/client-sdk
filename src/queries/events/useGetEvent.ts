import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Event } from "@interfaces";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENTS_QUERY_KEY(),
  eventId,
];

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
