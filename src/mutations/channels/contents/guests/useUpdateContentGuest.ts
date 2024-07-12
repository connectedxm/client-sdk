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
import { CONTENT_QUERY_KEY } from "@src/queries/contents/useGetContent";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels/contents/useGetChannelContentGuests";

export interface UpdateContentGuest {
  id: string;
  slug: string;
  contentId: string;
  accountId: string;
  type: ContentGuestType;
  name: string;
  title: string | null;
  bio: string | null;
  company: string | null;
  companyLink: string | null;
  companyBio: string | null;
  imageId: string | null;
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
  guest: UpdateContentGuest;
  guestId: string;
}

export const UpdateContentGuest = async ({
  channelId,
  contentId,
  guest,
  guestId,
  clientApiParams,
  queryClient,
}: UpdateContentGuestParams): Promise<ConnectedXMResponse<ContentGuest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<ContentGuest>>(
    `/channels/${channelId}/contents/${contentId}/guests/${guestId}`,
    guest
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
