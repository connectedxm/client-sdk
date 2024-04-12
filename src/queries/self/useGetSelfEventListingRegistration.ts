import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Registration } from "@interfaces";
import { SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY } from "./useGetSelfEventListingRegistrations";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_LISTING_REGISTRATION_QUERY_KEY = (
  eventId: string,
  registrationId: string
): QueryKey => [
  ...SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId),
  eventId,
  registrationId,
];

export const SET_SELF_EVENT_LISTING_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_LISTING_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListingRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_LISTING_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventListingRegistrationProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetSelfEventListingRegistration = async ({
  eventId,
  registrationId,
  clientApiParams,
}: GetSelfEventListingRegistrationProps): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `self/events/listings/${eventId}/registrations/${registrationId}`
  );
  return data;
};

export const useGetSelfEventListingRegistration = (
  eventId: string,
  registrationId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventListingRegistration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventListingRegistration>
  >(
    SELF_EVENT_LISTING_REGISTRATION_QUERY_KEY(eventId, registrationId),
    (params) =>
      GetSelfEventListingRegistration({ eventId, registrationId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
