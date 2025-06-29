import {
  ConnectedXMResponse,
  ContentGuest,
  ContentGuestType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContentGuests";

export interface UpdateContentGuestPayload {
  accountId?: string | null;
  type: ContentGuestType;
  name: string;
  title: string | null;
  bio: string | null;
  company: string | null;
  companyLink: string | null;
  companyBio: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedIn: string | null;
  tikTok: string | null;
  youtube: string | null;
  discord: string | null;
}

export interface UpdateContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  guest: UpdateContentGuestPayload;
  guestId: string;
  imageDataUri?: string;
}

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
