import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { AppendInfiniteQuery } from "@src/utilities";
import { ThreadMessageCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  message: ThreadMessageCreateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadMessage = async ({
  threadId,
  message,
  clientApiParams,
  queryClient,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads/${threadId}/messages`, message);

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<ThreadMessage>(
      queryClient,
      THREAD_MESSAGES_QUERY_KEY(threadId),
      data.data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useCreateThreadMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof CreateThreadMessage>>,
    Omit<CreateThreadMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadMessageParams,
    Awaited<ReturnType<typeof CreateThreadMessage>>
  >(CreateThreadMessage, options);
};
