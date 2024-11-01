import {
  ConnectedXMResponse,
  ContentGuest,
  ContentGuestType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries";
import { CONTENT_QUERY_KEY } from "@src/queries/contents/useGetContent";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContentGuests";
import { ContentGuestUpdateInputs } from "@src/params";

export interface UpdateContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  contentGuest: ContentGuestUpdateInputs;
  guestId: string;
  imageDataUri?: string;
}

export const UpdateContentGuest = async ({
  channelId,
  contentId,
  contentGuest,
  guestId,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateContentGuestParams): Promise<ConnectedXMResponse<ContentGuest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ContentGuest>>(
    `/channels/managed/${channelId}/contents/${contentId}/guests/${guestId}`,
    { contentGuest, imageDataUri }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
    queryClient.invalidateQueries({
      queryKey: CONTENT_QUERY_KEY(contentId),
    });
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    });
  }

  return data;
};

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
