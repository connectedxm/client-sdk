import { EVENT_SESSIONS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ListingSessionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventSessionParams extends MutationParams {
  eventId: string;
  session: ListingSessionCreateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventSession = async ({
  eventId,
  session,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateEventSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
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
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEventSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventSession>>,
      Omit<CreateEventSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSessionParams,
    Awaited<ReturnType<typeof CreateEventSession>>
  >(CreateEventSession, options);
};
