import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries";

export interface LikeContentParams extends MutationParams {
  channelId: string;
  contentId: string;
}

export const LikeContent = async ({
  channelId,
  contentId,
  clientApiParams,
  queryClient,
}: LikeContentParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/like`
  );

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
  }

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
