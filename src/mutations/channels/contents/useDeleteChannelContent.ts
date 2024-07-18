import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteChannelContentParams extends MutationParams {
  channelId: string;
  contentId: string;
}

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
