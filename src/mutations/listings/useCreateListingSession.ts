import { EVENT_SESSIONS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing, Session } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface CreateListingSessionParams extends MutationParams {
  eventId: string;
  session: Omit<
    Session,
    | "id"
    | "slug"
    | "event"
    | "sortOrder"
    | "tracks"
    | "nonSession"
    | "createdAt"
    | "updatedAt"
    | "speakers"
    | "sponsors"
    | "longDescription"
    | "image"
    | "streamInput"
  >;
}

export const CreateListingSession = async ({
  eventId,
  session,
  clientApiParams,
  queryClient,
}: CreateListingSessionParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sessions`,
    {
      session,
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
