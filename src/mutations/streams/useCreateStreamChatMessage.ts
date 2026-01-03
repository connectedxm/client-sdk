import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, StreamChatMessage } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { useConnectedMutation } from "@src/mutations/useConnectedMutation";
import { STREAM_CHAT_MESSAGES_QUERY_KEY } from "@src/queries/streams/useGetStreamChatMessages";
import { AppendInfiniteQuery } from "@src/utilities";
import { GetBaseInfiniteQueryKeys } from "@src/queries";

export interface CreateStreamChatMessageParams extends MutationParams {
  streamId: string;
  sessionId: string;
  message: string;
}

export const CreateStreamChatMessage = async ({
  streamId,
  sessionId,
  message,
  clientApiParams,
  queryClient,
}: CreateStreamChatMessageParams): Promise<
  ConnectedXMResponse<StreamChatMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/streams/${streamId}/sessions/${sessionId}/messages`,
    {
      message,
    }
  );

  if (queryClient && data.status === "ok") {
    const QueryKey = [
      ...STREAM_CHAT_MESSAGES_QUERY_KEY(streamId, sessionId),
      ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
    ];
    AppendInfiniteQuery<StreamChatMessage>(queryClient, QueryKey, data.data);
  }

  return data;
};

export const useCreateStreamChatMessage = (
  options: MutationOptions<
    Awaited<ReturnType<typeof CreateStreamChatMessage>>,
    Omit<CreateStreamChatMessageParams, "queryClient" | "clientApiParams">
  > = {}
) => {
  return useConnectedMutation<
    CreateStreamChatMessageParams,
    Awaited<ReturnType<typeof CreateStreamChatMessage>>
  >(CreateStreamChatMessage, options);
};

