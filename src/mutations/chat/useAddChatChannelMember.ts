import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannelMember, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { CHAT_CHANNEL_MEMBERS_QUERY_KEY } from "@src/queries";
import { ChatChannelMemberAddInputs } from "@src/params";

/**
 * @category Params
 * @group Chat
 */
export interface AddChatChannelMemberParams extends MutationParams {
  channelId: string;
  member: ChatChannelMemberAddInputs;
}

/**
 * @category Methods
 * @group Chat
 */
export const AddChatChannelMember = async ({
  channelId,
  member,
  clientApiParams,
  queryClient,
}: AddChatChannelMemberParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChatChannelMember>>(
    `/self/chat/channels/${channelId}/members/${member.accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHAT_CHANNEL_MEMBERS_QUERY_KEY(channelId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Chat
 */
export const useAddChatChannelMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddChatChannelMember>>,
      Omit<AddChatChannelMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddChatChannelMemberParams,
    Awaited<ReturnType<typeof AddChatChannelMember>>
  >(AddChatChannelMember, options);
};
