import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteContentParams extends MutationParams {
  channelId: string;
  contentId: string;
}

export const DeleteContent = async ({
  channelId,
  contentId,
  clientApiParams,
}: DeleteContentParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/contents/${contentId}`
  );

  return data;
};

export const useDeleteContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteContent>>,
      Omit<DeleteContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteContentParams,
    Awaited<ReturnType<typeof DeleteContent>>
  >(DeleteContent, options);
};
