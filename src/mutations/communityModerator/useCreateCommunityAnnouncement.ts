// import { QUERY_KEY as COMMUNITY_EVENTS } from "@context/queries/communities/useGetCommunityEvents";
// import { QUERY_KEY as SELF_LISTINGS } from "@context/queries/self/useGetSelfEventListings";

import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import {
  MutationParams,
  MutationOptions,
  useConnectedMutation,
} from "../useConnectedMutation";
import { AppendInfiniteQuery } from "@src/utilities";
import { COMMUNITY_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { GetBaseInfiniteQueryKeys } from "@src/queries/useConnectedInfiniteQuery";

export interface CreateCommunityAnnouncementParams extends MutationParams {
  communityId: string;
  title: string;
  html: string;
  email: boolean;
  push: boolean;
}

export const CreateCommunityAnnouncement = async ({
  communityId,
  title,
  html,
  email,
  push,
  clientApiParams,
  queryClient,
}: CreateCommunityAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Announcement>>(
    `/communityModerator/${communityId}/announcements`,
    {
      title,
      html,
      email,
      push,
    }
  );

  if (queryClient && data.status === "ok") {
    AppendInfiniteQuery<Announcement>(
      queryClient,
      [
        ...COMMUNITY_ANNOUNCEMENTS_QUERY_KEY(communityId),
        ...GetBaseInfiniteQueryKeys(clientApiParams.locale),
      ],
      data.data
    );
  }

  return data;
};

export const useCreateCommunityAnnouncement = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateCommunityAnnouncement>>,
      Omit<CreateCommunityAnnouncementParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCommunityAnnouncementParams,
    Awaited<ReturnType<typeof CreateCommunityAnnouncement>>
  >(CreateCommunityAnnouncement, options);
};
