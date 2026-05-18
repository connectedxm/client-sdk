import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { ThreadMessage } from "@src/interfaces";
import { THREAD_MESSAGES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessages";
import { THREAD_MESSAGE_REPLIES_QUERY_KEY } from "@src/queries/threads/useGetThreadMessageReplies";
import { InfiniteQueryHelpers } from "@src/utilities";

export interface CreateThreadMessageParams extends MutationParams {
  threadId: string;
  body: string;
  entities: any[];
  /**
   * Optional parent message id — set when posting into a sub-thread under
   * an existing message. Must belong to the same thread (server-enforced).
   */
  replyToId?: string;
}

export const CreateThreadMessage = async ({
  threadId,
  body,
  entities,
  replyToId,
  clientApiParams,
  queryClient,
}: CreateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(`/threads/${threadId}/messages`, {
    body,
    entities,
    ...(replyToId ? { replyToId } : {}),
  });

  if (queryClient && data.status === "ok") {
    if (replyToId) {
      // Sub-thread reply — invalidate the parent's replies cache and the
      // main message list (so the parent's _count.replies refreshes).
      queryClient.invalidateQueries({
        queryKey: THREAD_MESSAGE_REPLIES_QUERY_KEY(threadId, replyToId),
      });
      queryClient.invalidateQueries({
        queryKey: THREAD_MESSAGES_QUERY_KEY(threadId),
      });
    } else {
      // Top-level post — prepend to the main message list cache. Replies
      // live in their own per-parent cache and don't flow through here.
      InfiniteQueryHelpers.prepend<ThreadMessage>(
        queryClient,
        THREAD_MESSAGES_QUERY_KEY(threadId),
        data.data
      );
    }
  }

  return data;
};

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
