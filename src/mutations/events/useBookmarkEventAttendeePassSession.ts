import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSIONS_QUERY_KEY } from "@src/queries/events/useGetEventSessions";
import { EVENT_SESSION_QUERY_KEY } from "@src/queries/events/useGetEventSession";
import { SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA } from "@src/queries";

export interface BookmarkEventAttendeePassSessionParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const BookmarkEventAttendeePassSession = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
  queryClient,
}: BookmarkEventAttendeePassSessionParams): Promise<
  ConnectedXMResponse<Pass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/bookmark`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    });
    SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA(
      queryClient,
      [eventId, passId],
      data,
      [clientApiParams.locale]
    );
  }

  return data;
};

export const useBookmarkEventAttendeePassSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof BookmarkEventAttendeePassSession>>,
      Omit<
        BookmarkEventAttendeePassSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    BookmarkEventAttendeePassSessionParams,
    Awaited<ReturnType<typeof BookmarkEventAttendeePassSession>>
  >(BookmarkEventAttendeePassSession, options);
};
