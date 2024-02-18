import { ChatChannelMember, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY } from "@src/queries";

export interface AddSelfChatChannelMemberParams extends MutationParams {
  channelId: string;
  accountId: string;
}

export const AddSelfChatChannelMember = async ({
  channelId,
  accountId,
  clientApi,
  queryClient,
}: AddSelfChatChannelMemberParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<ChatChannelMember>>(
    `/self/chat/channels/${channelId}/members/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_CHAT_CHANNEL_MEMBERS_QUERY_KEY(channelId),
    });
  }

  return data;
};

export const useAddSelfChatChannelMember = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfChatChannelMember>>,
      Omit<AddSelfChatChannelMemberParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfChatChannelMemberParams,
    Awaited<ReturnType<typeof AddSelfChatChannelMember>>
  >(AddSelfChatChannelMember, params, options);
};
