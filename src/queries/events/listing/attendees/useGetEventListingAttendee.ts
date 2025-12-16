import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { EventRegistration } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_ATTENDEES_QUERY_KEY } from "./useGetEventListingAttendees";

export const EVENT_LISTING_ATTENDEE_QUERY_KEY = (
  eventId: string,
  accountId: string
): QueryKey => [...EVENT_LISTING_ATTENDEES_QUERY_KEY(eventId), accountId];

export const SET_EVENT_LISTING_ATTENDEE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_LISTING_ATTENDEE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventListingAttendee>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_LISTING_ATTENDEE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventListingAttendeeProps extends SingleQueryParams {
  eventId: string;
  accountId: string;
}

export const GetEventListingAttendee = async ({
  eventId,
  accountId,
  clientApiParams,
}: GetEventListingAttendeeProps): Promise<
  ConnectedXMResponse<EventRegistration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/attendees/${accountId}`
  );
  return data;
};

export const useGetEventListingAttendee = (
  eventId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventListingAttendee>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventListingAttendee>>(
    EVENT_LISTING_ATTENDEE_QUERY_KEY(eventId, accountId),
    (params) => GetEventListingAttendee({ eventId, accountId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!accountId,
    }
  );
};
