import { EVENT_SPEAKERS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSpeaker = async ({
  eventId,
  speakerId,
  clientApiParams,
  queryClient,
}: DeleteEventSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/speakers/${speakerId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventSpeaker>>,
      Omit<DeleteEventSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSpeakerParams,
    Awaited<ReturnType<typeof DeleteEventSpeaker>>
  >(DeleteEventSpeaker, options);
};
