import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SPEAKERS_QUERY_KEY,
  SET_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { EventListingSpeakerUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
  speaker: EventListingSpeakerUpdateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventListingSpeaker = async ({
  eventId,
  speaker,
  speakerId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventEvent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/speakers/${speakerId}`,
    {
      speaker,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SET_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventListingSpeaker>>,
      Omit<UpdateEventListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventListingSpeakerParams,
    Awaited<ConnectedXMResponse<EventEvent>>
  >(UpdateEventListingSpeaker, options);
};
