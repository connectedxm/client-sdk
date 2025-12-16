import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { EventListingSessionUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  session: EventListingSessionUpdateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventListingSession = async ({
  eventId,
  session,
  sessionId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateEventListingSessionParams): Promise<
  ConnectedXMResponse<EventEvent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventEvent>>(
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
    SET_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventListingSession>>,
      Omit<UpdateEventListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventListingSessionParams,
    Awaited<ConnectedXMResponse<EventEvent>>
  >(UpdateEventListingSession, options);
};
