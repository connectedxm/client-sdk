import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ListingRegistration } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ATTENDEES_QUERY_KEY } from "./useGetListingAttendees";

export const LISTING_ATTENDEE_QUERY_KEY = (
  eventId: string,
  accountId: string
): QueryKey => [...LISTING_ATTENDEES_QUERY_KEY(eventId), accountId];

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
