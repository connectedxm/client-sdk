import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  CHANNEL_CONTENT_QUERY_KEY,
  MANAGED_CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries";
import { CONTENT_QUERY_KEY } from "@src/queries/contents/useGetContent";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContentGuests";

export interface DeleteContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  guestId: string;
}

export const DeleteContentGuest = async ({
  channelId,
  contentId,
  guestId,
  clientApiParams,
  queryClient,
}: DeleteContentGuestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/managed/${channelId}/contents/${contentId}/guests/${guestId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
    queryClient.invalidateQueries({
      queryKey: MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
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
