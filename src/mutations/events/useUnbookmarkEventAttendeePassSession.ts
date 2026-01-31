import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSIONS_QUERY_KEY } from "@src/queries/events/useGetEventSessions";
import { EVENT_SESSION_QUERY_KEY } from "@src/queries/events/useGetEventSession";
import { SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA } from "@src/queries";

export interface UnbookmarkEventAttendeePassSessionParams
  extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const UnbookmarkEventAttendeePassSession = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
  queryClient,
}: UnbookmarkEventAttendeePassSessionParams): Promise<
  ConnectedXMResponse<Pass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/bookmark/undo`
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
      data
    );
  }

  return data;
};

export const useUnbookmarkEventAttendeePassSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnbookmarkEventAttendeePassSession>>,
      Omit<
        UnbookmarkEventAttendeePassSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnbookmarkEventAttendeePassSessionParams,
    Awaited<ReturnType<typeof UnbookmarkEventAttendeePassSession>>
  >(UnbookmarkEventAttendeePassSession, options);
};
