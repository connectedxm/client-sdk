import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_SESSION_QUERY_KEY,
  EVENT_SESSIONS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";
import {
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  SessionPassesInput,
} from "@src/queries/self/attendee";

export interface SubmitSelfEventRegistrationSessionPassesParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sessionPasses: SessionPassesInput;
}

export const SubmitSelfEventRegistrationSessionPasses = async ({
  eventId,
  sessionId,
  sessionPasses,
  clientApiParams,
  queryClient,
}: SubmitSelfEventRegistrationSessionPassesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/sessions/${sessionId}/submit`,
    sessionPasses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSIONS_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_QUERY_KEY(eventId, sessionId),
    });
  }

  return data;
};

export const useSubmitSelfEventRegistrationSessionPasses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventRegistrationSessionPasses>>,
      Omit<
        SubmitSelfEventRegistrationSessionPassesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventRegistrationSessionPassesParams,
    Awaited<ReturnType<typeof SubmitSelfEventRegistrationSessionPasses>>
  >(SubmitSelfEventRegistrationSessionPasses, options);
};
