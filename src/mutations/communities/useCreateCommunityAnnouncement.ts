import { Community, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { COMMUNITY_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

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
  ConnectedXMResponse<Community>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities/${communityId}/announcements`,
    {
      title,
      html,
      email,
      push,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_ANNOUNCEMENTS_QUERY_KEY(communityId),
    });
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
