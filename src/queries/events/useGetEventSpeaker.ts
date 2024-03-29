import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Speaker } from "@interfaces";
import { EVENT_SPEAKERS_QUERY_KEY } from "./useGetEventSpeakers";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_SPEAKER_QUERY_KEY = (
  eventId: string,
  speakerId: string
): QueryKey => [...EVENT_SPEAKERS_QUERY_KEY(eventId), speakerId];

export const SET_EVENT_SPEAKER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPEAKER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeaker>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SPEAKER_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventSpeakerProps extends SingleQueryParams {
  eventId: string;
  speakerId: string;
}

export const GetEventSpeaker = async ({
  eventId,
  speakerId,
  clientApiParams,
}: GetEventSpeakerProps): Promise<ConnectedXMResponse<Speaker>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/speakers/${speakerId}`
  );
  return data;
};

export const useGetEventSpeaker = (
  eventId: string = "",
  speakerId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSpeaker>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSpeaker>>(
    EVENT_SPEAKER_QUERY_KEY(eventId, speakerId),
    (params) => GetEventSpeaker({ eventId, speakerId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!speakerId && (options?.enabled ?? true),
    }
  );
};
