import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { Thread } from "@src/interfaces";
import { SET_THREAD_QUERY_DATA } from "@src/queries/threads/useGetThread";
import { ThreadUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadParams extends MutationParams {
  threadId: string;
  thread: ThreadUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThread = async ({
  threadId,
  thread,
  clientApiParams,
  queryClient,
}: UpdateThreadParams): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(`/threads/${threadId}`, thread);

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [threadId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useUpdateThread = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateThread>>,
    Omit<UpdateThreadParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadParams,
    Awaited<ReturnType<typeof UpdateThread>>
  >(UpdateThread, options);
};
