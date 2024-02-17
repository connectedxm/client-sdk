import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";

export interface UpdateSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: any;
  speakerId: string;
  buffer?: string;
}

export const UpdateSelfEventListingSpeaker = async ({
  eventId,
  speaker,
  speakerId,
  buffer,
  clientApi,
  queryClient,
  locale = "en",
}: UpdateSelfEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers/${speakerId}`,
    {
      speaker,
      buffer: buffer || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.speakers?.findIndex(
            (speaker: any) => speaker.id === data.data.id
          );
          if (index !== -1 && event.data.speakers) {
            event.data.speakers[index] = data.data;
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
            (speaker: any) => speaker.id === data.data.id
          );
          if (index !== -1 && event.data.speakers) {
            event.data.speakers[index] = data.data;
          }
        }

        return event;
      }
    );
  }

  return data;
};

export const useUpdateSelfEventListingSpeaker = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateSelfEventListingSpeaker>>,
    UpdateSelfEventListingSpeakerParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventListingSpeakerParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateSelfEventListingSpeaker, params, options);
};
