import { ConnectedXMResponse, Channel } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { ChannelCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface CreateChannelParams extends MutationParams {
  channel: ChannelCreateInputs;
  imageDataUri?: any;
}

/**
 * @category Methods
 * @group Channels
 */
export const CreateChannel = async ({
  channel,
  imageDataUri,
  clientApiParams,
}: CreateChannelParams): Promise<ConnectedXMResponse<Channel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Channel>>(
    `/channels`,
    {
      channel,
      imageDataUri: imageDataUri || undefined,
    }
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useCreateChannel = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateChannel>>,
      Omit<CreateChannelParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelParams,
    Awaited<ReturnType<typeof CreateChannel>>
  >(CreateChannel, options);
};
