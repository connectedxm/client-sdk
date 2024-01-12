import { ClientAPI } from "@src/ClientAPI";
import type { Speaker } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SET_EVENT_SPEAKER_QUERY_DATA } from "./useGetEventSpeaker";
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
  locale,
}: GetEventSpeakersProps): Promise<ConnectedXMResponse<Speaker[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events/${eventId}/speakers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSpeakers = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSpeakers>>
  >(
    EVENT_SPEAKERS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSpeakers({ eventId, ...params }),
    {
      enabled: !!eventId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (speakerId) => [eventId, speakerId],
          SET_EVENT_SPEAKER_QUERY_DATA
        ),
    }
  );
};

export default useGetEventSpeakers;
