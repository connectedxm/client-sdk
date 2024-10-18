import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Ticket } from "@interfaces";
import { EVENT_TICKETS_QUERY_KEY } from "./useGetEventTickets";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_TICKET_QUERY_KEY = (
  eventId: string,
  ticketId: string
): QueryKey => [...EVENT_TICKETS_QUERY_KEY(eventId), ticketId];

export const SET_EVENT_TICKET_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TICKET_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicket>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_TICKET_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventTicketProps extends SingleQueryParams {
  eventId: string;
  ticketId: string;
}

export const GetEventTicket = async ({
  eventId,
  ticketId,
  clientApiParams,
}: GetEventTicketProps): Promise<ConnectedXMResponse<Ticket>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/tickets/${ticketId}`
  );
  return data;
};

export const useGetEventTicket = (
  eventId: string = "",
  ticketId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTicket>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicket>>(
    EVENT_TICKET_QUERY_KEY(eventId, ticketId),
    (params) => GetEventTicket({ eventId, ticketId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!ticketId && (options?.enabled ?? true),
    }
  );
};
