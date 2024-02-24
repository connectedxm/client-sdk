import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

export const RemoveSelfEventListingSpeaker = async ({
  eventId,
  speakerId,
  clientApiParams,
  queryClient,
  locale = "en",
}: RemoveSelfEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.speakers?.findIndex(
            (speaker: any) => speaker.id === speakerId
          );
          if (index !== -1 && event.data.speakers) {
            event.data.speakers.splice(index, 1);
          }
        }
        return event;
      }
    );
    queryClient.setQueryData(
      [...SELF_EVENT_LISTING_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.speakers?.findIndex(
            (speaker: any) => speaker.id === speakerId
          );
          if (index !== -1 && event.data.speakers) {
            event.data.speakers.splice(index, 1);
          }
        }
        return event;
      }
    );
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers/${speakerId}`
  );

  return data;
};

export const useRemoveSelfEventListingSpeaker = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventListingSpeaker>>,
      Omit<
        RemoveSelfEventListingSpeakerParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSpeakerParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSpeaker>>
  >(RemoveSelfEventListingSpeaker, params, options);
};
