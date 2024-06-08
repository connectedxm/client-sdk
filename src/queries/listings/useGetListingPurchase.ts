import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, ListingPurchase } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_PURCHASES_QUERY_KEY } from "./useGetListingPurchases";

export const LISTING_PURCHASE_QUERY_KEY = (
  eventId: string,
  purchaseId: string
): QueryKey => [...LISTING_PURCHASES_QUERY_KEY(eventId), purchaseId];

export const SET_LISTING_PURCHASE_QUERY_KEY = (
  client: QueryClient,
  keyParams: Parameters<typeof LISTING_PURCHASE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventListingPurchase>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_PURCHASE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventListingPurchaseProps extends SingleQueryParams {
  eventId: string;
  purchaseId: string;
}

export const GetSelfEventListingPurchase = async ({
  eventId,
  purchaseId,
  clientApiParams,
}: GetSelfEventListingPurchaseProps): Promise<
  ConnectedXMResponse<ListingPurchase>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/purchases/${purchaseId}`
  );
  return data;
};

export const useGetSelfEventListingPurchase = (
  eventId: string = "",
  purchaseId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventListingPurchase>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventListingPurchase>
  >(
    LISTING_PURCHASE_QUERY_KEY(eventId, purchaseId),
    (params) => GetSelfEventListingPurchase({ eventId, purchaseId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!purchaseId,
    }
  );
};
