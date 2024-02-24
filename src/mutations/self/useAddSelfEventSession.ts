import { SELF_EVENT_SESSIONS_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface AddSelfEventSessionParams extends MutationParams {
  eventId: string;
  sessionId: string;
}

export const AddSelfEventSession = async ({
  eventId,
  sessionId,
  clientApiParams,
  queryClient,
}: AddSelfEventSessionParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/self/events/${eventId}/sessions/${sessionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_SESSIONS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useAddSelfEventSession = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventSession>>,
      Omit<AddSelfEventSessionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventSessionParams,
    Awaited<ReturnType<typeof AddSelfEventSession>>
  >(AddSelfEventSession, params, options);
};
