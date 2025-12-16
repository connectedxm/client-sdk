import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ConnectedXMResponse, EventEvent } from "@interfaces";
import { EVENT_LISTINGS_QUERY_KEY } from "./useGetEventListings";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTING_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_LISTINGS_QUERY_KEY(false),
  eventId,
];

export const SET_EVENT_LISTING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_LISTING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventListing>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_LISTING_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventListingProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventListing = async ({
  eventId,
  clientApiParams,
}: GetEventListingProps): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}`);
  return data;
};

export const useGetEventListing = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventListing>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventListing>>(
    EVENT_LISTING_QUERY_KEY(eventId),
    (params) => GetEventListing({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
