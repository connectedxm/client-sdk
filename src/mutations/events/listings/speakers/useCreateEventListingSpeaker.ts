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
import { EventListingSpeakerCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventListingSpeakerCreateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventListingSpeaker = async ({
  eventId,
  speaker,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventEvent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/speakers`,
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
export const useCreateEventListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventListingSpeaker>>,
      Omit<CreateEventListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventListingSpeakerParams,
    Awaited<ReturnType<typeof CreateEventListingSpeaker>>
  >(CreateEventListingSpeaker, options);
};
