import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";

export interface RemoveSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const RemoveSelfEventListingSession = async ({
  eventId,
  sessionId,
  clientApi,
  queryClient,
  locale = "en",
}: RemoveSelfEventListingSessionParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sessions?.findIndex(
            (session: any) => session.id === sessionId
          );
          if (index !== -1 && event.data.sessions) {
            event.data.sessions.splice(index, 1);
          }
        }
        return event;
      }
    );
    queryClient.setQueryData(
      [...SELF_EVENT_LISTING_QUERY_KEY(eventId), locale],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sessions?.findIndex(
            (session: any) => session.id === sessionId
          );
          if (index !== -1 && event.data.sessions) {
            event.data.sessions.splice(index, 1);
          }
        }
        return event;
      }
    );
  }

  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sessions/${sessionId}`
  );

  return data;
};

export const useRemoveSelfEventListingSession = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventListingSession>>,
      Omit<RemoveSelfEventListingSessionParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventListingSessionParams,
    Awaited<ReturnType<typeof RemoveSelfEventListingSession>>
  >(RemoveSelfEventListingSession, params, options);
};
