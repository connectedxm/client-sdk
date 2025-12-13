import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENT_GUESTS_QUERY_KEY,
  CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Channels
 */
export interface DeleteContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  guestId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const DeleteContentGuest = async ({
  channelId,
  contentId,
  guestId,
  clientApiParams,
  queryClient,
}: DeleteContentGuestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useDeleteContentGuest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteContentGuest>>,
      Omit<DeleteContentGuestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteContentGuestParams,
    Awaited<ReturnType<typeof DeleteContentGuest>>
  >(DeleteContentGuest, options);
};
