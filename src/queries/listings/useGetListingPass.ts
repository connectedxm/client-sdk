import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, ListingPass } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_PASSES_QUERY_KEY } from "./useGetListingPasses";

export const LISTING_PASS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...LISTING_PASSES_QUERY_KEY(eventId), passId];

export const SET_LISTING_PASS_QUERY_KEY = (
  client: QueryClient,
  keyParams: Parameters<typeof LISTING_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListingPass>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_PASS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventListingPassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventListingPass = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventListingPassProps): Promise<ConnectedXMResponse<ListingPass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/passes/${passId}`);
  return data;
};

export const useGetSelfEventListingPass = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventListingPass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventListingPass>>(
    LISTING_PASS_QUERY_KEY(eventId, passId),
    (params) => GetSelfEventListingPass({ eventId, passId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
