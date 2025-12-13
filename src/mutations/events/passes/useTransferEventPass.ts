import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
export interface TransferEventPassParams extends MutationParams {
  passId: string;
  eventId: string;
  receiverId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const TransferEventPass = async ({
  passId,
  eventId,
  receiverId,
  clientApiParams,
  queryClient,
}: TransferEventPassParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/transfer`,
    {
      receiverId,
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
export const useTransferEventPass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof TransferEventPass>>,
      Omit<TransferEventPassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TransferEventPassParams,
    Awaited<ReturnType<typeof TransferEventPass>>
  >(TransferEventPass, options);
};
