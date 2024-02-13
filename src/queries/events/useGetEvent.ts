import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Event } from "@interfaces";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_QUERY_KEY = (eventId: string) => [
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

interface GetEventProps extends SingleQueryParams {
  eventId: string;
}

export const GetEvent = async ({
  eventId,
  clientApi,
}: GetEventProps): Promise<ConnectedXMResponse<Event>> => {
  const { data } = await clientApi.get(`/events/${eventId}`);
  return data;
};

const useGetEvent = (
  eventId: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetEvent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEvent>>(
    EVENT_QUERY_KEY(eventId),
    (params) => GetEvent({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId,
    }
  );
};

export default useGetEvent;
