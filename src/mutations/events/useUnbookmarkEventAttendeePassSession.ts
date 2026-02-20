import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
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
    SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA(
      queryClient,
      [eventId, passId],
      data,
      [clientApiParams.locale]
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
