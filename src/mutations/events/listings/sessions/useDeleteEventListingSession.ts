import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY, SET_EVENT_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventListingSession = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: DeleteEventListingSessionParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/sessions/${sessionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventListingSession>>,
      Omit<DeleteEventListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventListingSessionParams,
    Awaited<ReturnType<typeof DeleteEventListingSession>>
  >(DeleteEventListingSession, options);
};
