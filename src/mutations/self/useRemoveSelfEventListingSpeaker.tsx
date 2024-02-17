import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";

export interface RemoveSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

export const RemoveSelfEventListingSpeaker = async ({
  eventId,
  speakerId,
  clientApi,
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

  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers/${speakerId}`
  );

  return data;
};

export const useRemoveSelfEventListingSpeaker = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveSelfEventListingSpeaker>>,
    RemoveSelfEventListingSpeakerParams
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSpeakerParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSpeaker>>
  >(RemoveSelfEventListingSpeaker, params, options);
};
