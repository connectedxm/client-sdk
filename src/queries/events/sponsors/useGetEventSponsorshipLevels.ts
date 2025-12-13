import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ConnectedXMResponse, EventSponsorshipLevel } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_QUERY_KEY } from "@src/queries";

export const EVENT_SPONSORSHIP_LEVELS_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_QUERY_KEY(eventId), "SPONSORSHIPS"];

export const SET_EVENT_SPONSORSHIP_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORSHIP_LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsorshipLevels>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

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
