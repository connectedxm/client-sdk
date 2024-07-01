import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface LikeContentParams extends MutationParams {
  channelId: string;
  contentId: string;
}

export const LikeContent = async ({
  channelId,
  contentId,
  clientApiParams,
}: LikeContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/like`
  );

  return data;
};

export const useLikeContent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LikeContent>>,
      Omit<LikeContentParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LikeContentParams,
    Awaited<ReturnType<typeof LikeContent>>
  >(LikeContent, options);
};
