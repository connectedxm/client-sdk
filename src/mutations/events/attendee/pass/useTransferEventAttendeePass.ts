import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_ATTENDEE_PASS_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";

export interface TransferEventAttendeePassParams extends MutationParams {
  passId: string;
  eventId: string;
  receiverId: string;
}

export const TransferEventAttendeePass = async ({
  passId,
  eventId,
  receiverId,
  clientApiParams,
  queryClient,
}: TransferEventAttendeePassParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/transfer`,
    {
      receiverId,
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

export const useTransferEventAttendeePass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof TransferEventAttendeePass>>,
      Omit<TransferEventAttendeePassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TransferEventAttendeePassParams,
    Awaited<ReturnType<typeof TransferEventAttendeePass>>
  >(TransferEventAttendeePass, options);
};
