import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, EventPass } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_PASSES_QUERY_KEY } from "@src/queries";

export const EVENT_LISTING_PASS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...EVENT_LISTING_PASSES_QUERY_KEY(eventId), passId];

export const SET_EVENT_LISTING_PASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_LISTING_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventListingPass>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_LISTING_PASS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventListingPassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventListingPass = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventListingPassProps): Promise<ConnectedXMResponse<EventPass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/passes/${passId}`);
  return data;
};

export const useGetEventListingPass = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventListingPass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventListingPass>>(
    EVENT_LISTING_PASS_QUERY_KEY(eventId, passId),
    (params) => GetEventListingPass({ eventId, passId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
