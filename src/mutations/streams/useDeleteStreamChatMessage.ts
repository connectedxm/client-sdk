import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { STREAM_CHAT_MESSAGES_QUERY_KEY } from "@src/queries/streams/useGetStreamChatMessages";

export interface DeleteStreamChatMessageParams extends MutationParams {
  streamId: string;
  sessionId: string;
  messageId: string;
}

export const DeleteStreamChatMessage = async ({
  streamId,
  sessionId,
  messageId,
  clientApiParams,
  queryClient,
}: DeleteStreamChatMessageParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(
    `/streams/${streamId}/sessions/${sessionId}/messages/${messageId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: STREAM_CHAT_MESSAGES_QUERY_KEY(streamId, sessionId),
    });
  }

  return data;
};

export const useDeleteStreamChatMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof DeleteStreamChatMessage>>,
    Omit<DeleteStreamChatMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    DeleteStreamChatMessageParams,
    Awaited<ReturnType<typeof DeleteStreamChatMessage>>
  >(DeleteStreamChatMessage, options);
};

