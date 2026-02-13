import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_ATTENDEE_PASS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries/self/attendee";

export interface CancelPassParams extends MutationParams {
  passId: string;
  eventId: string;
  registrationId: string;
  issueRefund?: boolean;
  accountId: string;
}

export const CancelPass = async ({
  passId,
  eventId,
  issueRefund,
  accountId,
  clientApiParams,
  queryClient,
}: CancelPassParams): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/attendee/passes/${passId}/cancel`,
    {
      issueRefund,
      accountId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useCancelPass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelPass>>,
      Omit<CancelPassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelPassParams,
    Awaited<ReturnType<typeof CancelPass>>
  >(CancelPass, options);
};
