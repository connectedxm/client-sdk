import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
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
  locale,
}: GetEventProps): Promise<ConnectedXMResponse<Event>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events/${eventId}`);
  return data;
};

const useGetEvent = (eventId: string) => {
  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetEvent>>>(
    EVENT_QUERY_KEY(eventId),
    (params) => GetEvent({ eventId, ...params }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEvent;
