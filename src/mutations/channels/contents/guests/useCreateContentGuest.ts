import {
  ConnectedXMResponse,
  ContentGuest,
  ContentGuestType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENT_GUESTS_QUERY_KEY,
  CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries";
import { ContentGuestCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface CreateContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  guest: ContentGuestCreateInputs & { type: ContentGuestType };
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const CreateContentGuest = async ({
  channelId,
  contentId,
  guest,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateContentGuestParams): Promise<ConnectedXMResponse<ContentGuest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ContentGuest>>(
    `/channels/${channelId}/contents/${contentId}/guests`,
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
export const useCreateContentGuest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateContentGuest>>,
      Omit<CreateContentGuestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateContentGuestParams,
    Awaited<ReturnType<typeof CreateContentGuest>>
  >(CreateContentGuest, options);
};
