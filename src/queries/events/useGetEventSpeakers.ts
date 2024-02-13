import type { ConnectedXMResponse, Speaker } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import {
  EVENT_SPEAKER_QUERY_KEY,
  SET_EVENT_SPEAKER_QUERY_DATA,
} from "./useGetEventSpeaker";
import { EVENT_QUERY_KEY } from "./useGetEvent";

export const EVENT_SPEAKERS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPEAKERS",
];

export const SET_EVENT_SPEAKERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPEAKERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSpeakers>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SPEAKERS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventSpeakersProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSpeakers = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
}: GetEventSpeakersProps): Promise<ConnectedXMResponse<Speaker[]>> => {
  const { data } = await clientApi.get(`/events/${eventId}/speakers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (speakerId) => EVENT_SPEAKER_QUERY_KEY(eventId, speakerId),
      SET_EVENT_SPEAKER_QUERY_DATA
    );
  }

  return data;
};

const useGetEventSpeakers = (
  eventId: string,
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetEventSpeakers>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventSpeakers>>(
    EVENT_SPEAKERS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSpeakers({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};

export default useGetEventSpeakers;
