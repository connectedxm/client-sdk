import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Announcement } from "@context/interfaces";
import { QUERY_KEY as ANNOUNCEMENTS } from "@context/queries/communities/useGetCommunityAnnouncements";
import AppendInfiniteQuery from "@context/utilities/AppendInfiniteQuery";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

// import { QUERY_KEY as COMMUNITY_EVENTS } from "@context/queries/communities/useGetCommunityEvents";
// import { QUERY_KEY as SELF_LISTINGS } from "@context/queries/self/useGetSelfEventListings";

interface CreateCommunityAnnouncementParams extends MutationParams {
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
}: CreateCommunityAnnouncementParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/communityModerator/${communityId}/announcements`,
    {
      title,
      html,
      email,
      push,
    },
  );
  return data;
};

export const useCreateCommunityAnnouncement = (communityId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<
    Omit<CreateCommunityAnnouncementParams, "communityId">
  >(
    (params: Omit<CreateCommunityAnnouncementParams, "communityId">) =>
      CreateCommunityAnnouncement({ ...params, communityId }),
    {
      onSuccess: (response: ConnectedXMResponse<Announcement>) => {
        AppendInfiniteQuery(
          queryClient,
          [ANNOUNCEMENTS, communityId, ""],
          response?.data,
        );
      },
    },
  );
};

export default useCreateCommunityAnnouncement;
