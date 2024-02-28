import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_EVENT_SESSIONS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveSelfEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const RemoveSelfEventSession = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventSessionParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Account>>(
    `/self/events/${eventId}/sessions/${sessionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_SESSIONS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useRemoveSelfEventSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventSession>>,
      Omit<RemoveSelfEventSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventSessionParams,
    Awaited<ReturnType<typeof RemoveSelfEventSession>>
  >(RemoveSelfEventSession, options);
};
