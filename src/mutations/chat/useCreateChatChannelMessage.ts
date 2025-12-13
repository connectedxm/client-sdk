import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { CHAT_CHANNEL_MESSAGES_QUERY_KEY } from "@src/queries";
import { ChatChannelMessageCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Chat
 */
export interface CreateChatChannelMessageParams extends MutationParams {
  channelId: string;
  message: ChatChannelMessageCreateInputs;
}

/**
 * @category Methods
 * @group Chat
 */
export const CreateChatChannelMessage = async ({
  channelId,
  message,
  queryClient,
  clientApiParams,
}: CreateChatChannelMessageParams): Promise<
  ConnectedXMResponse<ChatChannelMessage>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<ChatChannelMessage>
  >(`/self/chat/channels/${channelId}/messages`, message);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHAT_CHANNEL_MESSAGES_QUERY_KEY(channelId.toString()),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Chat
 */
export const useCreateChatChannelMessage = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChatChannelMessage>>,
      Omit<
        CreateChatChannelMessageParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChatChannelMessageParams,
    Awaited<ReturnType<typeof CreateChatChannelMessage>>
  >(CreateChatChannelMessage, options);
};
