import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_PASS_QUERY_KEY } from "@src/queries/events/passes";
import { EVENT_ATTENDEE_QUERY_KEY } from "@src/queries/events/attendee";

/**
 * @category Params
 * @group Events
 */
export interface CancelEventPassParams extends MutationParams {
  passId: string;
  eventId: string;
  registrationId: string;
  issueRefund?: boolean;
}

/**
 * @category Methods
 * @group Events
 */
export const CancelEventPass = async ({
  passId,
  eventId,
  issueRefund,
  clientApiParams,
  queryClient,
}: CancelEventPassParams): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/attendee/passes/${passId}/cancel`,
    {
      issueRefund,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_ATTENDEE_QUERY_KEY(eventId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCancelEventPass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelEventPass>>,
      Omit<CancelEventPassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventPassParams,
    Awaited<ReturnType<typeof CancelEventPass>>
  >(CancelEventPass, options);
};
