import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUERY_KEY } from "./useGetListing";

export const LISTING_REPORT_QUERY_KEY = (eventId: string): QueryKey => [
  ...LISTING_QUERY_KEY(eventId),
  "REPORT",
];

export interface GetSelfEventListingReportProps extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventListingReport = async ({
  eventId,
  clientApiParams,
}: GetSelfEventListingReportProps): Promise<ConnectedXMResponse<any>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/report`);
  return data;
};

export const useGetSelfEventListingReport = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventListingReport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventListingReport>>(
    LISTING_REPORT_QUERY_KEY(eventId),
    (params) => GetSelfEventListingReport({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
