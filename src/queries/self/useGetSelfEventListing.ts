import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { EventListing } from "@interfaces";
import { SELF_EVENT_LISTINGS_QUERY_KEY } from "./useGetSelfEventListings";
import { QueryClient } from "@tanstack/react-query";

export const SELF_EVENT_LISTING_QUERY_KEY = (eventId: string) => [
  ...SELF_EVENT_LISTINGS_QUERY_KEY(),
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

interface GetSelfEventListingProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventListing = async ({
  eventId,
  locale,
}: GetSelfEventListingProps): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`self/events/listings/${eventId}`);
  return data;
};

const useGetSelfEventListing = (eventId: string) => {
  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfEventListing>>
  >(
    SELF_EVENT_LISTING_QUERY_KEY(eventId),
    (params) => GetSelfEventListing({ eventId, ...params }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetSelfEventListing;
