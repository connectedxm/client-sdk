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
  clientApi,
  queryClient,
}: CreateCommunityAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
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
      COMMUNITY_ANNOUNCEMENTS_QUERY_KEY(communityId),
      data
    );
  }

  return data;
};

export const useCreateCommunityAnnouncement = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateCommunityAnnouncement>>,
      Omit<CreateCommunityAnnouncementParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCommunityAnnouncementParams,
    Awaited<ReturnType<typeof CreateCommunityAnnouncement>>
  >(CreateCommunityAnnouncement, params, options);
};
