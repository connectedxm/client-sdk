import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPEAKERS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ListingSpeakerUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
  speaker: ListingSpeakerUpdateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSpeaker = async ({
  eventId,
  speaker,
  speakerId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateEventSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
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
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSpeaker>>,
      Omit<UpdateEventSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSpeakerParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateEventSpeaker, options);
};
