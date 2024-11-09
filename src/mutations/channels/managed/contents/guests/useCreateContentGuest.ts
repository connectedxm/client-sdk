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
import {
  CHANNEL_CONTENT_QUERY_KEY,
  MANAGED_CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries";
import { CONTENT_QUERY_KEY } from "@src/queries/contents/useGetContent";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContentGuests";
import { ContentGuestCreateInputs } from "@src/params";

export interface CreateContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  contentGuest: ContentGuestCreateInputs;
  imageDataUri?: string;
}

export const CreateContentGuest = async ({
  channelId,
  contentId,
  contentGuest,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateContentGuestParams): Promise<ConnectedXMResponse<ContentGuest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ContentGuest>>(
    `/channels/managed/${channelId}/contents/${contentId}/guests`,
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
    queryClient.invalidateQueries({
      queryKey: MANAGED_CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
  }

  return data;
};

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
