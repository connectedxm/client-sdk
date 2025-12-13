import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventSession = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: DeleteEventSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
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

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventSession>>,
      Omit<DeleteEventSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSessionParams,
    Awaited<ReturnType<typeof DeleteEventSession>>
  >(DeleteEventSession, options);
};
