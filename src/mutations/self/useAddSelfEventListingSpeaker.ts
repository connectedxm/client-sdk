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

export interface EventListingSpeaker {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
}

export interface AddSelfEventListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventListingSpeaker;
}

export const AddSelfEventListingSpeaker = async ({
  eventId,
  speaker,
  clientApiParams,
  queryClient,
}: AddSelfEventListingSpeakerParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/speakers`,
    {
      speaker,
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

export const useAddSelfEventListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventListingSpeaker>>,
      Omit<AddSelfEventListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventListingSpeakerParams,
    Awaited<ReturnType<typeof AddSelfEventListingSpeaker>>
  >(AddSelfEventListingSpeaker, options);
};
