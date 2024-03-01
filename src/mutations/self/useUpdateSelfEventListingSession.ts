import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENT_SESSIONS_QUERY_KEY,
  SET_SELF_EVENT_LISTING_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  session: any;
  sessionId: string;
}

export const UpdateSelfEventListingSession = async ({
  eventId,
  session,
  sessionId,
  clientApiParams,
  queryClient,
}: UpdateSelfEventListingSessionParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sessions/${sessionId}`,
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

export const useUpdateSelfEventListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventListingSession>>,
      Omit<
        UpdateSelfEventListingSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventListingSessionParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateSelfEventListingSession, options);
};
