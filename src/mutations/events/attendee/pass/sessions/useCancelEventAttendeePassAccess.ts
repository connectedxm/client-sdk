import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

export interface CancelEventAttendeePassAccessParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
}

export const CancelEventAttendeePassAccess = async ({
  eventId,
  passId,
  sessionId,
  clientApiParams,
  queryClient,
}: CancelEventAttendeePassAccessParams): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventSessionAccess>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/cancel`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useCancelEventAttendeePassAccess = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelEventAttendeePassAccess>>,
      Omit<
        CancelEventAttendeePassAccessParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventAttendeePassAccessParams,
    Awaited<ConnectedXMResponse<EventSessionAccess>>
  >(CancelEventAttendeePassAccess, options);
};
