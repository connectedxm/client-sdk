import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, EventListing } from "@interfaces";
import { SELF_EVENT_LISTINGS_QUERY_KEY } from "./useGetSelfEventListings";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_LISTING_QUERY_KEY = (eventId: string): QueryKey => [
  ...SELF_EVENT_LISTINGS_QUERY_KEY(false),
  eventId,
];

export const SET_SELF_EVENT_LISTING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_LISTING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListing>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_LISTING_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventListingProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventListing = async ({
  eventId,
  clientApiParams,
}: GetSelfEventListingProps): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`self/events/listings/${eventId}`);
  return data;
};

export const useGetSelfEventListing = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventListing>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventListing>>(
    SELF_EVENT_LISTING_QUERY_KEY(eventId),
    (params) => GetSelfEventListing({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
