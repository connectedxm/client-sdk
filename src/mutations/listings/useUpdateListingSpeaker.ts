import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_SPEAKERS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: any;
  speakerId: string;
  buffer?: string;
}

export const UpdateListingSpeaker = async ({
  eventId,
  speaker,
  speakerId,
  buffer,
  clientApiParams,
  queryClient,
}: UpdateListingSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/speakers/${speakerId}`,
    {
      speaker,
      buffer: buffer || undefined,
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

export const useUpdateListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListingSpeaker>>,
      Omit<UpdateListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingSpeakerParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateListingSpeaker, options);
};
