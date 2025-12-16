import { ConnectedXMResponse, ContentGuest } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENT_GUESTS_QUERY_KEY,
  CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries";
import { ContentGuestUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface UpdateContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  guestId: string;
  guest: ContentGuestUpdateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const UpdateContentGuest = async ({
  channelId,
  contentId,
  guest,
  guestId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateContentGuestParams): Promise<ConnectedXMResponse<ContentGuest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ContentGuest>>(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`,
    { contentGuest: guest, imageDataUri }
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
export const useUpdateContentGuest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateContentGuest>>,
      Omit<UpdateContentGuestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateContentGuestParams,
    Awaited<ReturnType<typeof UpdateContentGuest>>
  >(UpdateContentGuest, options);
};
