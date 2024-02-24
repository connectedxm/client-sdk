import { GetClientAPI } from "@src/ClientAPI";
import { ChatChannel, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_CHAT_CHANNELS_QUERY_KEY } from "@src/queries";

export interface CreateSelfChatChannelParams extends MutationParams {
  name: string;
  accountIds: string[];
}

export const CreateSelfChatChannel = async ({
  name,
  accountIds,
  clientApiParams,
  queryClient,
}: CreateSelfChatChannelParams): Promise<ConnectedXMResponse<ChatChannel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ChatChannel>>(
    `/self/chat/channels`,
    {
      name,
      accountIds,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_CHAT_CHANNELS_QUERY_KEY(),
    });
  }

  return data;
};

export const useCreateSelfChatChannel = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfChatChannel>>,
      Omit<CreateSelfChatChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfChatChannelParams,
    Awaited<ReturnType<typeof CreateSelfChatChannel>>
  >(CreateSelfChatChannel, params, options);
};
