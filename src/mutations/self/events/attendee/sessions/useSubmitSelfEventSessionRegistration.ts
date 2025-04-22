import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_SESSION_QUERY_KEY,
  EVENT_SESSIONS_QUERY_KEY,
} from "@src/queries";
import {
  SELF_EVENT_ATTENDEE_QUERY_KEY,
  AccessesInput,
} from "@src/queries/self/attendee";

export interface SubmitSelfEventSessionRegistrationParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  accesses: AccessesInput;
}

export const SubmitSelfEventSessionRegistration = async ({
  eventId,
  sessionId,
  accesses,
  clientApiParams,
  queryClient,
}: SubmitSelfEventSessionRegistrationParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/sessions/${sessionId}/submit`,
    accesses
  );

  if (queryClient && data.status === "ok") {
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

export const useSubmitSelfEventSessionRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSelfEventSessionRegistration>>,
      Omit<
        SubmitSelfEventSessionRegistrationParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSelfEventSessionRegistrationParams,
    Awaited<ReturnType<typeof SubmitSelfEventSessionRegistration>>
  >(SubmitSelfEventSessionRegistration, options);
};
