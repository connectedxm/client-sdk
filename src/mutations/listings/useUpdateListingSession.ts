import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  session: {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
  };
  imageDataUri?: string;
}

export const UpdateListingSession = async ({
  eventId,
  session,
  sessionId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateListingSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sessions/${sessionId}`,
    {
      session,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useUpdateListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListingSession>>,
      Omit<UpdateListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingSessionParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateListingSession, options);
};
