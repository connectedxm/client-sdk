import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, EventSponsorship } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SPONSORSHIP_LEVELS_QUERY_KEY } from "./useGetEventSponsorshipLevels";

export const EVENT_SPONSORSHIP_QUERY_KEY = (
  eventId: string,
  sponsorshipId: string
): QueryKey => [...EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId), sponsorshipId];

export interface GetEventSponsorshipProps extends SingleQueryParams {
  eventId: string;
  sponsorshipId: string;
}

export const GetEventSponsorship = async ({
  eventId,
  sponsorshipId,
  clientApiParams,
}: GetEventSponsorshipProps): Promise<
  ConnectedXMResponse<EventSponsorship>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sponsorships/${sponsorshipId}`
  );
  return data;
};

export const useGetEventSponsorship = (
  eventId: string = "",
  sponsorshipId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSponsorship>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSponsorship>>(
    EVENT_SPONSORSHIP_QUERY_KEY(eventId, sponsorshipId),
    (params) => GetEventSponsorship({ eventId, sponsorshipId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!sponsorshipId && (options?.enabled ?? true),
    }
  );
};
