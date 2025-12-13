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
import { LISTING_QUERY_KEY } from "./useGetListing";

export const LISTING_EMAIL_QUERY_KEY = (
  eventId: string,
  type: EventEmailType
): QueryKey => [...LISTING_QUERY_KEY(eventId), type];

export const SET_LISTING_EMAIL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LISTING_EMAIL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListingEmail>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_EMAIL_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventListingEmailProps extends SingleQueryParams {
  eventId: string;
  type: EventEmailType;
}

export const GetSelfEventListingEmail = async ({
  eventId,
  type,
  clientApiParams,
}: GetSelfEventListingEmailProps): Promise<
  ConnectedXMResponse<EventEmail | null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/emails/${type}`);
  return data;
};

export const useGetSelfEventListingEmail = (
  eventId: string = "",
  type: EventEmailType,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventListingEmail>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventListingEmail>>(
    LISTING_EMAIL_QUERY_KEY(eventId, type),
    (params) => GetSelfEventListingEmail({ eventId, type, ...params }),
    {
      ...options,
      enabled: !!eventId && !!type,
    }
  );
};
