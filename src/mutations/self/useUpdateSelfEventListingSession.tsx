import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";

export interface UpdateSelfEventListingSessionParams extends MutationParams {
  eventId: string;
  session: any;
  sessionId: string;
}

export const UpdateSelfEventListingSession = async ({
  eventId,
  session,
  sessionId,
  clientApi,
  queryClient,
}: UpdateSelfEventListingSessionParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sessions/${sessionId}`,
    {
      session,
    }
  );

  // Possibly broken - looks like this was built assuming the response was a session (it's actually returning an EventListing)
  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(EVENT_QUERY_KEY(eventId), (event: any) => {
      if (event && event.data) {
        const index = event?.data?.sessions?.findIndex(
          (session: any) => session.id === data.data.id
        );
        if (index !== -1 && event.data.sessions) {
          event.data.sessions[index] = data.data;
        }
      }
      return event;
    });
    queryClient.setQueryData(
      SELF_EVENT_LISTING_QUERY_KEY(eventId),
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sessions?.findIndex(
            (session: any) => session.id === data.data.id
          );
          if (index !== -1 && event.data.sessions) {
            event.data.sessions[index] = data.data;
          }
        }
        return event;
      }
    );
  }

  return data;
};

export const useUpdateSelfEventListingSession = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ConnectedXMResponse<EventListing>>,
    UpdateSelfEventListingSessionParams
  >
) => {
  return useConnectedMutation<
    UpdateSelfEventListingSessionParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateSelfEventListingSession, params, options);
};
