import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_QUERY_KEY } from "../useGetEventListing";

export const EVENT_LISTING_REPORT_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_LISTING_QUERY_KEY(eventId),
  "REPORT",
];

export interface GetEventListingReportProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventListingReport = async ({
  eventId,
  clientApiParams,
}: GetEventListingReportProps): Promise<ConnectedXMResponse<any>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/report`);
  return data;
};

export const useGetEventListingReport = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventListingReport>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventListingReport>>(
    EVENT_LISTING_REPORT_QUERY_KEY(eventId),
    (params) => GetEventListingReport({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};

