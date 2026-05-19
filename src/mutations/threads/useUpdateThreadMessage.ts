import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { ThreadMessage } from "@src/interfaces";
import { SET_THREAD_MESSAGE_QUERY_DATA } from "@src/queries/threads/useGetThreadMessage";
import { ThreadMessageEntityInput } from "./useCreateThreadMessage";

export interface UpdateThreadMessageParams extends MutationParams {
  threadId: string;
  messageId: string;
  body?: string;
  /**
   * Replace the message's entity list (mentions / links / styled segments).
   * Omit to leave existing entities untouched; pass `[]` to clear all.
   */
  entities?: ThreadMessageEntityInput[];
  /**
   * Replace the message's image attachments. Omit to leave existing
   * attachments untouched; pass `[]` to clear all.
   */
  imageIds?: string[];
  /** Replace video attachments. Omit = leave alone, `[]` = clear. */
  videoIds?: string[];
  /** Replace file attachments. Omit = leave alone, `[]` = clear. */
  fileIds?: number[];
}

export const UpdateThreadMessage = async ({
  threadId,
  messageId,
  body,
  entities,
  imageIds,
  videoIds,
  fileIds,
  clientApiParams,
  queryClient,
}: UpdateThreadMessageParams): Promise<ConnectedXMResponse<ThreadMessage>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put(
    `/threads/${threadId}/messages/${messageId}`,
    {
      ...(body !== undefined ? { body } : {}),
      ...(entities !== undefined ? { entities } : {}),
      ...(imageIds !== undefined ? { imageIds } : {}),
      ...(videoIds !== undefined ? { videoIds } : {}),
      ...(fileIds !== undefined ? { fileIds } : {}),
    }
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_MESSAGE_QUERY_DATA(queryClient, [threadId, messageId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

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
