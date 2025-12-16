import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EventListingSessionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventListingSessionParams extends MutationParams {
  eventId: string;
  session: EventListingSessionCreateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventListingSession = async ({
  eventId,
  session,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateEventListingSessionParams): Promise<
  ConnectedXMResponse<EventEvent>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/sessions`,
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
export const useCreateEventListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventListingSession>>,
      Omit<CreateEventListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventListingSessionParams,
    Awaited<ReturnType<typeof CreateEventListingSession>>
  >(CreateEventListingSession, options);
};
