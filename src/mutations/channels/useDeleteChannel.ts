import { ConnectedXMResponse, Channel } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteChannelParams extends MutationParams {
  channelId: string;
}

export const DeleteChannel = async ({
  channelId,

  clientApiParams,
}: DeleteChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Channel>>(
    `/channels/${channelId}`
  );

  return data;
};

export const useDeleteChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChannel>>,
      Omit<DeleteChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelParams,
    Awaited<ReturnType<typeof DeleteChannel>>
  >(DeleteChannel, options);
};
