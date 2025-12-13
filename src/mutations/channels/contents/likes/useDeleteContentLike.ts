import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Channels
 */
export interface DeleteContentLikeParams extends MutationParams {
  channelId: string;
  contentId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const DeleteContentLike = async ({
  channelId,
  contentId,
  clientApiParams,
  queryClient,
}: DeleteContentLikeParams): Promise<ConnectedXMResponse<Content>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/like`
  );

  if (data.status === "ok" && queryClient) {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useDeleteContentLike = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteContentLike>>,
      Omit<DeleteContentLikeParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteContentLikeParams,
    Awaited<ReturnType<typeof DeleteContentLike>>
  >(DeleteContentLike, options);
};
