import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const DeleteListingSession = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: DeleteListingSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sessions/${sessionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useDeleteListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteListingSession>>,
      Omit<DeleteListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteListingSessionParams,
    Awaited<ReturnType<typeof DeleteListingSession>>
  >(DeleteListingSession, options);
};
