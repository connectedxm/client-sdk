import { EVENT_SPEAKERS_QUERY_KEY, LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface DeleteListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

export const DeleteListingSpeaker = async ({
  eventId,
  speakerId,
  clientApiParams,
  queryClient,
}: DeleteListingSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/speakers/${speakerId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SetSingleQueryData(
      queryClient,
      LISTING_QUERY_KEY(eventId),
      clientApiParams.locale,
      data
    );
  }

  return data;
};

export const useDeleteListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteListingSpeaker>>,
      Omit<DeleteListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteListingSpeakerParams,
    Awaited<ReturnType<typeof DeleteListingSpeaker>>
  >(DeleteListingSpeaker, options);
};
