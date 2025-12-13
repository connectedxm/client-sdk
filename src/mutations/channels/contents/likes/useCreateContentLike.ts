import { ConnectedXMResponse, Content } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Channels
 */
export interface CreateContentLikeParams extends MutationParams {
  channelId: string;
  contentId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const CreateContentLike = async ({
  channelId,
  contentId,
  clientApiParams,
  queryClient,
}: CreateContentLikeParams): Promise<ConnectedXMResponse<Content>> => {
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

/**
 * @category Mutations
 * @group Channels
 */
export const useCreateContentLike = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContentLike>>,
      Omit<CreateContentLikeParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateContentLikeParams,
    Awaited<ReturnType<typeof CreateContentLike>>
  >(CreateContentLike, options);
};
