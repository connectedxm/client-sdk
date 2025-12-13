import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Channels
 */
export interface DeleteChannelContentParams extends MutationParams {
  channelId: string;
  contentId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const DeleteChannelContent = async ({
  channelId,
  contentId,
  clientApiParams,
}: DeleteChannelContentParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/contents/${contentId}`
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useDeleteChannelContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteChannelContent>>,
      Omit<DeleteChannelContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelContentParams,
    Awaited<ReturnType<typeof DeleteChannelContent>>
  >(DeleteChannelContent, options);
};
