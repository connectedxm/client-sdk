import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadMessage = async ({
  threadId,
  messageId,
  clientApiParams,
  queryClient,
}: DeleteThreadMessageParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/threads/${threadId}/messages/${messageId}`
  );

  if (queryClient && data.status === "ok") {
    // Invalidate the messages list to refetch
    queryClient.invalidateQueries({
      queryKey: THREAD_MESSAGES_QUERY_KEY(threadId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThreadMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof DeleteThreadMessage>>,
    Omit<DeleteThreadMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMessageParams,
    Awaited<ReturnType<typeof DeleteThreadMessage>>
  >(DeleteThreadMessage, options);
};
