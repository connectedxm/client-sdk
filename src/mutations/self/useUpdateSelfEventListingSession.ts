import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
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

  // Possibly broken - looks like this was built assuming the response was a session (it's actually returning an EventListing)
  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(eventId), clientApiParams.locale],
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
    queryClient.setQueryData(
      [...SELF_EVENT_LISTING_QUERY_KEY(eventId), clientApiParams.locale],
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
