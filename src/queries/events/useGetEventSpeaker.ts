import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Speaker } from "@interfaces";
import { EVENT_SPEAKERS_QUERY_KEY } from "./useGetEventSpeakers";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_SPEAKER_QUERY_KEY = (
  eventId: string,
  speakerId: string
): QueryKey => [...EVENT_SPEAKERS_QUERY_KEY(eventId), speakerId];

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
