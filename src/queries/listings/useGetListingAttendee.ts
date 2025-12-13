import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ListingRegistration } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ATTENDEES_QUERY_KEY } from "./useGetListingAttendees";

export const LISTING_ATTENDEE_QUERY_KEY = (
  eventId: string,
  accountId: string
): QueryKey => [...LISTING_ATTENDEES_QUERY_KEY(eventId), accountId];

export const SET_LISTING_ATTENDEE_QUERY_KEY = (
  client: QueryClient,
  keyParams: Parameters<typeof LISTING_ATTENDEE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListingRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_ATTENDEE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventListingRegistrationProps
  extends SingleQueryParams {
  eventId: string;
  accountId: string;
}

export const GetSelfEventListingRegistration = async ({
  eventId,
  accountId,
  clientApiParams,
}: GetSelfEventListingRegistrationProps): Promise<
  ConnectedXMResponse<ListingRegistration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/attendees/${accountId}`
  );
  return data;
};

export const useGetSelfEventListingRegistration = (
  eventId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventListingRegistration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventListingRegistration>
  >(
    LISTING_ATTENDEE_QUERY_KEY(eventId, accountId),
    (params) =>
      GetSelfEventListingRegistration({ eventId, accountId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!accountId,
    }
  );
};
