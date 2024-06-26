import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GROUP_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface CreateGroupAnnouncementParams extends MutationParams {
  groupId: string;
  title: string;
  html: string;
  email: boolean;
  push: boolean;
}

export const CreateGroupAnnouncement = async ({
  groupId,
  title,
  html,
  email,
  push,
  clientApiParams,
  queryClient,
}: CreateGroupAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<Announcement>>(
    `/groups/${groupId}/announcements`,
    {
      title,
      html,
      email,
      push,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_ANNOUNCEMENTS_QUERY_KEY(groupId),
    });
  }

  return data;
};

export const useCreateGroupAnnouncement = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateGroupAnnouncement>>,
      Omit<CreateGroupAnnouncementParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupAnnouncementParams,
    Awaited<ReturnType<typeof CreateGroupAnnouncement>>
  >(CreateGroupAnnouncement, options);
};
