import { EVENT_SESSIONS_QUERY_KEY, LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";

export interface CreateListingSessionParams extends MutationParams {
  eventId: string;
  session: {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
  };
  imageDataUri?: string;
}

export const CreateListingSession = async ({
  eventId,
  session,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateListingSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sessions`,
    {
      session,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SetSingleQueryData(
      queryClient,
      LISTING_QUERY_KEY(eventId),
      clientApiParams.locale,
      data
    );
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useCreateListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateListingSession>>,
      Omit<CreateListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateListingSessionParams,
    Awaited<ReturnType<typeof CreateListingSession>>
  >(CreateListingSession, options);
};
