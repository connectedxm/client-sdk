import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASS_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

export interface CancelEventAttendeePassParams extends MutationParams {
  passId: string;
  eventId: string;
  registrationId: string;
  issueRefund?: boolean;
}

export const CancelEventAttendeePass = async ({
  passId,
  eventId,
  issueRefund,
  clientApiParams,
  queryClient,
}: CancelEventAttendeePassParams): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/attendee/passes/${passId}/cancel`,
    {
      issueRefund,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useCancelEventAttendeePass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelEventAttendeePass>>,
      Omit<CancelEventAttendeePassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventAttendeePassParams,
    Awaited<ReturnType<typeof CancelEventAttendeePass>>
  >(CancelEventAttendeePass, options);
};
