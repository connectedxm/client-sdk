import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { EventEmail, EventEmailType } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_QUERY_KEY } from "../useGetEventListing";

export const EVENT_LISTING_EMAIL_QUERY_KEY = (
  eventId: string,
  type: EventEmailType
): QueryKey => [...EVENT_LISTING_QUERY_KEY(eventId), type];

export const SET_EVENT_LISTING_EMAIL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_LISTING_EMAIL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventListingEmail>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_LISTING_EMAIL_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventListingEmailProps extends SingleQueryParams {
  eventId: string;
  type: EventEmailType;
}

export const GetEventListingEmail = async ({
  eventId,
  type,
  clientApiParams,
}: GetEventListingEmailProps): Promise<
  ConnectedXMResponse<EventEmail | null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/emails/${type}`);
  return data;
};

export const useGetEventListingEmail = (
  eventId: string = "",
  type: EventEmailType,
  options: SingleQueryOptions<ReturnType<typeof GetEventListingEmail>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventListingEmail>>(
    EVENT_LISTING_EMAIL_QUERY_KEY(eventId, type),
    (params) => GetEventListingEmail({ eventId, type, ...params }),
    {
      ...options,
      enabled: !!eventId && !!type,
    }
  );
};

