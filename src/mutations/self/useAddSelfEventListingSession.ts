import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing, Session } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface AddSelfEventListingSessionParams extends MutationParams {
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

export const AddSelfEventListingSession = async ({
  eventId,
  session,
  clientApiParams,
  queryClient,
}: AddSelfEventListingSessionParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sessions`,
    {
      session,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useAddSelfEventListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventListingSession>>,
      Omit<AddSelfEventListingSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventListingSessionParams,
    Awaited<ReturnType<typeof AddSelfEventListingSession>>
  >(AddSelfEventListingSession, options);
};
