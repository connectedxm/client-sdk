import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface UnlikeContentParams extends MutationParams {
  channelId: string;
  contentId: string;
}

export const UnlikeContent = async ({
  channelId,
  contentId,
  clientApiParams,
}: UnlikeContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/like`
  );

  return data;
};

export const useUnlikeContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnlikeContent>>,
      Omit<UnlikeContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnlikeContentParams,
    Awaited<ReturnType<typeof UnlikeContent>>
  >(UnlikeContent, options);
};
