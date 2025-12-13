import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ThreadMessage } from "@src/interfaces";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries";
import { ThreadMessageUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
  message: ThreadMessageUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadMessage = async ({
  threadId,
  messageId,
  message,
  clientApiParams,
  queryClient,
}: UpdateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(
    `/threads/${threadId}/messages/${messageId}`,
    message
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, messageId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useUpdateThreadMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateThreadMessage>>,
    Omit<UpdateThreadMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadMessageParams,
    Awaited<ReturnType<typeof UpdateThreadMessage>>
  >(UpdateThreadMessage, options);
};
