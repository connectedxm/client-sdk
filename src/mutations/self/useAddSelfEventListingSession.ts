import { EVENT_QUERY_KEY, SELF_EVENT_LISTING_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, EventListing, Session } from "@src/interfaces";

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
  clientApi,
  queryClient,
  locale = "en",
}: AddSelfEventListingSessionParams): Promise<
  ConnectedXMResponse<EventListing>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/self/events/listings/${eventId}/sessions`,
    {
      session,
    }
  );

  if (queryClient && data.status === "ok") {
    if (data.data && !!eventId) {
      queryClient.setQueryData(
        [...EVENT_QUERY_KEY(eventId), locale],
        (oldData: any) => {
          const event = oldData
            ? JSON.parse(JSON.stringify(oldData))
            : undefined;
          if (event && event.data) {
            if (event.data?.sessions) {
              event.data.sessions.push(data.data);
            } else {
              event.data.sessions = [data.data];
            }
          }
          return event;
        }
      );
      queryClient.setQueryData(
        [...SELF_EVENT_LISTING_QUERY_KEY(eventId), locale],
        (oldData: any) => {
          const event = oldData
            ? JSON.parse(JSON.stringify(oldData))
            : undefined;
          if (event && event.data) {
            if (event.data?.sessions) {
              event.data.sessions.push(data.data);
            } else {
              event.data.sessions = [data.data];
            }
          }
          return event;
        }
      );
    }
  }

  return data;
};

export const useAddSelfEventListingSession = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventListingSession>>,
      Omit<AddSelfEventListingSessionParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventListingSessionParams,
    Awaited<ReturnType<typeof AddSelfEventListingSession>>
  >(AddSelfEventListingSession, params, options);
};
