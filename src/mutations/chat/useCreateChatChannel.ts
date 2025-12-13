import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannelMember, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { CHAT_CHANNELS_QUERY_KEY } from "@src/queries";
import { ChatChannelCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Chat
 */
export interface CreateChatChannelParams extends MutationParams {
  channel: ChatChannelCreateInputs;
}

/**
 * @category Methods
 * @group Chat
 */
export const CreateChatChannel = async ({
  channel,
  clientApiParams,
  queryClient,
}: CreateChatChannelParams): Promise<
  ConnectedXMResponse<ChatChannelMember>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChatChannelMember>>(
    `/self/chat/channels`,
    channel
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHAT_CHANNELS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Chat
 */
export const useCreateChatChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChatChannel>>,
      Omit<CreateChatChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChatChannelParams,
    Awaited<ReturnType<typeof CreateChatChannel>>
  >(CreateChatChannel, options);
};
