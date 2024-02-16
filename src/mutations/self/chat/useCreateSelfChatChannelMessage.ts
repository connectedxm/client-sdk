import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { ChatChannelMessage } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";

interface CreateSelfChatChannelMessageParams extends MutationParams {
  channelId: string;
  text: string;
}

export const CreateSelfChatChannelMessage = async ({
  channelId,
  text,
}: CreateSelfChatChannelMessageParams): Promise<
  ConnectedXMResponse<ChatChannelMessage>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/chat/channels/${channelId}/messages`,
    {
      text,
    }
  );
  return data;
};

export const useCreateSelfChatChannelMessage = (channelId: string) => {
  return useConnectedMutation(
    (params: Omit<CreateSelfChatChannelMessageParams, "channelId">) =>
      CreateSelfChatChannelMessage({ ...params, channelId }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof CreateSelfChatChannelMessage>>
      ) => {},
    }
  );
};

export default useCreateSelfChatChannelMessage;
