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

export interface RemoveSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const RemoveSelfEventListingSession = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventListingSessionParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sessions/${sessionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    SET_SELF_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

export const useRemoveSelfEventListingSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventListingSession>>,
      Omit<
        RemoveSelfEventListingSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSessionParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSession>>
  >(RemoveSelfEventListingSession, options);
};
