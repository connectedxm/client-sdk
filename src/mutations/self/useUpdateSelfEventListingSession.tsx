import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { EVENT_QUERY_KEY } from "@src/queries";

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

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      EVENT_QUERY_KEY(eventId),
      // [EVENT, response.data?.event?.slug],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sessions?.findIndex(
            (session: any) => session.id === response.data.id
          );
          if (index !== -1 && event.data.sessions) {
            event.data.sessions[index] = response.data;
          }
        }
        return event;
      }
    );
    queryClient.setQueryData(
      [EVENT_LISTING, response.data?.event?.slug],
      (event: any) => {
        if (event && event.data) {
          const index = event?.data?.sessions?.findIndex(
            (session: any) => session.id === response.data.id
          );
          if (index !== -1 && event.data.sessions) {
            event.data.sessions[index] = response.data;
          }
        }
        return event;
      }
    );
  }

  return data;
};

export const useUpdateSelfEventListingSession = (
  options: MutationOptions<
    Awaited<ConnectedXMResponse<EventListing>>,
    UpdateSelfEventListingSessionParams
  >
) => {
  return useConnectedMutation<
    UpdateSelfEventListingSessionParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(
    (params: UpdateSelfEventListingSessionParams) =>
      UpdateSelfEventListingSession({ ...params }),
    options
  );
};
