import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, EventSponsorshipLevel } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_QUERY_KEY } from "./useGetEvent";

export const EVENT_SPONSORSHIP_LEVELS_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_QUERY_KEY(eventId), "SPONSORSHIPS"];

export interface GetEventSponsorshipLevelsProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventSponsorshipLevels = async ({
  eventId,
  clientApiParams,
}: GetEventSponsorshipLevelsProps): Promise<
  ConnectedXMResponse<EventSponsorshipLevel[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/sponsorships`);
  return data;
};

export const useGetEventSponsorshipLevels = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSponsorshipLevels>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSponsorshipLevels>>(
    EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId),
    (params) => GetEventSponsorshipLevels({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
