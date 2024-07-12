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
import { CHANNEL_CONTENT_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContent";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels/content/useGetChannelContentGuests";

export interface CreateContentGuest {
  id: string;
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

export interface CreateContentGuestParams extends MutationParams {
  channelId: string;
  contentId: string;
  guest: CreateContentGuest;
}

export const CreateContentGuest = async ({
  channelId,
  contentId,
  guest,
  clientApiParams,
  queryClient,
}: CreateContentGuestParams): Promise<ConnectedXMResponse<ContentGuest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ContentGuest>>(
    `/channels/${channelId}/contents/${contentId}/guests`,
    guest
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CONTENT_QUERY_KEY(contentId),
    });
    queryClient.invalidateQueries({
      queryKey: CONTENT_GUESTS_QUERY_KEY(contentId),
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
