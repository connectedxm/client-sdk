import { ChatChannelMessage, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface CreateSelfChatChannelMessageParams extends MutationParams {
  channelId: string;
  text: string;
}

export const CreateSelfChatChannelMessage = async ({
  channelId,
  text,
  queryClient,
  clientApi,
}: CreateSelfChatChannelMessageParams): Promise<
  ConnectedXMResponse<ChatChannelMessage>
> => {
  const { data } = await clientApi.post<
    ConnectedXMResponse<ChatChannelMessage>
  >(`/self/chat/channels/${channelId}/messages`, {
    text,
  });

  if (queryClient && data.status === "ok") {
    // NOTHING
  }

  return data;
};

export const useCreateSelfChatChannelMessage = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfChatChannelMessage>>,
      Omit<CreateSelfChatChannelMessageParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfChatChannelMessageParams,
    Awaited<ReturnType<typeof CreateSelfChatChannelMessage>>
  >(CreateSelfChatChannelMessage, params, options);
};
