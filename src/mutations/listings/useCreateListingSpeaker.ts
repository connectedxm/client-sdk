import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_SPEAKERS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface EventListingSpeaker {
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  company: string | null;
  bio: string | null;
}

export interface CreateListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: EventListingSpeaker;
}

export const CreateListingSpeaker = async ({
  eventId,
  speaker,
  clientApiParams,
  queryClient,
}: CreateListingSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/speakers`,
    {
      speaker,
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

export const useCreateListingSpeaker = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateListingSpeaker>>,
      Omit<CreateListingSpeakerParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateListingSpeakerParams,
    Awaited<ReturnType<typeof CreateListingSpeaker>>
  >(CreateListingSpeaker, options);
};
