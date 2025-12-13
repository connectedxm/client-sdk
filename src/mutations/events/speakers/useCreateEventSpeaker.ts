import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPEAKERS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ListingSpeakerCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSpeakerParams extends MutationParams {
  eventId: string;
  speaker: ListingSpeakerCreateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSpeaker = async ({
  eventId,
  speaker,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateEventSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
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
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventSpeaker>>,
      Omit<CreateEventSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSpeakerParams,
    Awaited<ReturnType<typeof CreateEventSpeaker>>
  >(CreateEventSpeaker, options);
};
