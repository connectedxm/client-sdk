import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { ChatChannelMember } from "@context/interfaces";
import useConnectedMutation, {
  MutationParams,
} from "@context/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY } from "@context/queries/self/chat/useGetSelfChatChannelMembers";
import { useQueryClient } from "@tanstack/react-query";

interface AddSelfChatChannelMemberParams extends MutationParams {
  channelId: string;
  accountId: string;
}

export const AddSelfChatChannelMember = async ({
  channelId,
  accountId,
}: AddSelfChatChannelMemberParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/self/chat/channels/${channelId}/members/${accountId}`
  );
  return data;
};

export const useAddSelfChatChannelMember = (channelId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (params: Omit<AddSelfChatChannelMemberParams, "channelId">) =>
      AddSelfChatChannelMember({ ...params, channelId }),
    {
      onSuccess: (
        _response: Awaited<ReturnType<typeof AddSelfChatChannelMember>>
      ) => {
        queryClient.invalidateQueries(
          SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY(channelId)
        );
      },
    }
  );
};

export default useAddSelfChatChannelMember;
