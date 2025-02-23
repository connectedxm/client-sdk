import { ThreadMember, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { THREAD_MEMBERS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface JoinGroupThreadParams extends MutationParams {
  groupId: string;
  threadId: string;
}

export const JoinGroupThread = async ({
  groupId,
  threadId,
  clientApiParams,
  queryClient,
}: JoinGroupThreadParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ThreadMember>>(
    `/groups/${groupId}/threads/${threadId}/join`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
  }

  return data;
};

export const useJoinGroupThread = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinGroupThread>>,
      Omit<JoinGroupThreadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinGroupThreadParams,
    Awaited<ReturnType<typeof JoinGroupThread>>
  >(JoinGroupThread, options);
};
