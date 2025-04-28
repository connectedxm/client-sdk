import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_SPEAKERS_QUERY_KEY, LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface CreateListingSpeakerParams extends MutationParams {
  eventId: string;
  speaker: {
    firstName: string | null;
    lastName: string | null;
    title: string | null;
    company: string | null;
    bio: string | null;
  };
  imageDataUri?: string;
}

export const CreateListingSpeaker = async ({
  eventId,
  speaker,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateListingSpeakerParams): Promise<ConnectedXMResponse<EventListing>> => {
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
    SetSingleQueryData(
      queryClient,
      LISTING_QUERY_KEY(eventId),
      clientApiParams.locale,
      data
    );
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
