import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_ATTENDEE_PASS_QUERY_KEY,
  SELF_EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries/self/attendee";

export interface TransferPassParams extends MutationParams {
  passId: string;
  eventId: string;
  receiverId: string;
}

export const TransferPass = async ({
  passId,
  eventId,
  receiverId,
  clientApiParams,
  queryClient,
}: TransferPassParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/transfer`,
    {
      receiverId,
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

export const useTransferPass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof TransferPass>>,
      Omit<TransferPassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TransferPassParams,
    Awaited<ReturnType<typeof TransferPass>>
  >(TransferPass, options);
};
