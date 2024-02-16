import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { ChatChannel } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannels";
import { useQueryClient } from "@tanstack/react-query";

interface CreateSelfChatChannelParams extends MutationParams {
  name: string;
  accountIds: string[];
}

export const CreateSelfChatChannel = async ({
  name,
  accountIds,
}: CreateSelfChatChannelParams): Promise<ConnectedXMResponse<ChatChannel>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/chat/channels`, {
    name,
    accountIds,
  });
  return data;
};

export const useCreateSelfChatChannel = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (params: Omit<CreateSelfChatChannelParams, "name">) =>
      CreateSelfChatChannel({ ...params, name: "" }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof CreateSelfChatChannel>>
      ) => {
        queryClient.invalidateQueries(SELF_CHAT_CHANNELS_QUERY_KEY());
      },
    }
  );
};

export default useCreateSelfChatChannel;
