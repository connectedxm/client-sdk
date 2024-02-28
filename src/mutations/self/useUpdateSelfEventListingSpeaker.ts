import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

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
  clientApiParams,
  queryClient,
}: UpdateSelfEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers/${speakerId}`,
    {
      speaker,
      buffer: buffer || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), clientApiParams.locale],
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
      [...SELF_EVENT_LISTING_QUERY_KEY(eventId), clientApiParams.locale],
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
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventListingSpeaker>>,
      Omit<
        UpdateSelfEventListingSpeakerParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventListingSpeakerParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateSelfEventListingSpeaker, options);
};
