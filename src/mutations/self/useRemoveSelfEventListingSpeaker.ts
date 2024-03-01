import {
  EVENT_SPEAKERS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speakerId: string;
}

export const RemoveSelfEventListingSpeaker = async ({
  eventId,
  speakerId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers/${speakerId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPEAKERS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useRemoveSelfEventListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventListingSpeaker>>,
      Omit<
        RemoveSelfEventListingSpeakerParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSpeakerParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSpeaker>>
  >(RemoveSelfEventListingSpeaker, options);
};
