import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { EVENT_SESSIONS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ListingSessionUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  session: ListingSessionUpdateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSession = async ({
  eventId,
  session,
  sessionId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateEventSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
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

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSession>>,
      Omit<UpdateEventSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateEventSession, options);
};
