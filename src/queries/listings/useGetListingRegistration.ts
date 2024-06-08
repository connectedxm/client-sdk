import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ListingRegistration } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_REGISTRATIONS_QUERY_KEY } from "./useGetListingRegistrations";

export const LISTING_REGISTRATION_QUERY_KEY = (
  eventId: string,
  registrationId: string
): QueryKey => [...LISTING_REGISTRATIONS_QUERY_KEY(eventId), registrationId];

export const SET_LISTING_REGISTRATION_QUERY_KEY = (
  client: QueryClient,
  keyParams: Parameters<typeof LISTING_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListingRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_REGISTRATION_QUERY_KEY(...keyParams),
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
  ConnectedXMResponse<ListingRegistration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/registrations/${registrationId}`
  );
  return data;
};

export const useGetSelfEventListingRegistration = (
  eventId: string = "",
  registrationId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventListingRegistration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventListingRegistration>
  >(
    LISTING_REGISTRATION_QUERY_KEY(eventId, registrationId),
    (params) =>
      GetSelfEventListingRegistration({ eventId, registrationId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!registrationId,
    }
  );
};
