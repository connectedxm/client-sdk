import { EVENT_SPEAKERS_QUERY_KEY, SET_EVENT_LISTING_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventListingSpeaker = async ({
  eventId,
  speakerId,
  clientApiParams,
  queryClient,
}: DeleteEventListingSpeakerParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/speakers/${speakerId}`
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
export const useDeleteEventListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventListingSpeaker>>,
      Omit<DeleteEventListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventListingSpeakerParams,
    Awaited<ReturnType<typeof DeleteEventListingSpeaker>>
  >(DeleteEventListingSpeaker, options);
};
