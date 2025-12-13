import type { ConnectedXMResponse, Session } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  useConnectedInfiniteQuery,
  setFirstPageData,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SPEAKER_QUERY_KEY } from "./useGetEventSpeaker";
import { GetClientAPI } from "@src/ClientAPI";
import { QueryClient, QueryKey } from "@tanstack/react-query";

export const EVENT_SPEAKER_SESSIONS_QUERY_KEY = (
  eventId: string,
  speakerId: string
): QueryKey => [...EVENT_SPEAKER_QUERY_KEY(eventId, speakerId), "SESSIONS"];

export const SET_EVENT_SPEAKER_SESSIONS_FIRST_PAGE = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPEAKER_SESSIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakerSessions>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SPEAKER_SESSIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventSpeakerSessionsProps
  extends Omit<InfiniteQueryParams, "pageParam"> {
  eventId: string;
  speakerId: string;
}

export const GetEventSpeakerSessions = async ({
  eventId,
  speakerId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventSpeakerSessionsProps & { pageParam?: number }): Promise<
  ConnectedXMResponse<Session[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/speakers/${speakerId}/sessions`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

export const useGetEventSpeakerSessions = (
  eventId: string = "",
  speakerId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSpeakerSessions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakerSessions>>
  >(
    EVENT_SPEAKER_SESSIONS_QUERY_KEY(eventId, speakerId),
    (params: InfiniteQueryParams) =>
      GetEventSpeakerSessions({ eventId, speakerId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!speakerId && (options?.enabled ?? true),
    }
  );
};
