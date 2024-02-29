import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY } from "@src/queries";

export interface CreateSelfChatChannelMessageParams extends MutationParams {
  channelId: string;
  text: string;
}

export const CreateSelfChatChannelMessage = async ({
  channelId,
  text,
  queryClient,
  clientApiParams,
}: CreateSelfChatChannelMessageParams): Promise<
  ConnectedXMResponse<ChatChannelMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<ChatChannelMessage>
  >(`/self/chat/channels/${channelId}/messages`, {
    text,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId.toString()),
    });
  }

  return data;
};

export const useCreateSelfChatChannelMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfChatChannelMessage>>,
      Omit<
        CreateSelfChatChannelMessageParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfChatChannelMessageParams,
    Awaited<ReturnType<typeof CreateSelfChatChannelMessage>>
  >(CreateSelfChatChannelMessage, options);
};
