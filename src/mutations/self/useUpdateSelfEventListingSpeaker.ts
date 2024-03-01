import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENT_SPEAKERS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
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
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
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
