import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

export interface CancelSelfEventSessionAccessParams extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
  accountId: string;
  sendEmail?: boolean;
}

export const CancelSelfEventSessionAccess = async ({
  eventId,
  passId,
  sessionId,
  accountId,
  sendEmail = true,
  clientApiParams,
  queryClient,
}: CancelSelfEventSessionAccessParams): Promise<
  ConnectedXMResponse<EventSessionAccess>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventSessionAccess>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/cancel`,
    { sendEmail, accountId }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useCancelSelfEventSessionAccess = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelSelfEventSessionAccess>>,
      Omit<
        CancelSelfEventSessionAccessParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelSelfEventSessionAccessParams,
    Awaited<ConnectedXMResponse<EventSessionAccess>>
  >(CancelSelfEventSessionAccess, options);
};
