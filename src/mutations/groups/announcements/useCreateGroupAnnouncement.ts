import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GROUP_ANNOUNCEMENTS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { GroupAnnouncementCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Groups
 */
export interface CreateGroupAnnouncementParams extends MutationParams {
  groupId: string;
  announcement: GroupAnnouncementCreateInputs;
}

/**
 * @category Methods
 * @group Groups
 */
export const CreateGroupAnnouncement = async ({
  groupId,
  announcement,
  clientApiParams,
  queryClient,
}: CreateGroupAnnouncementParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<Announcement>>(
    `/groups/${groupId}/announcements`,
    announcement
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_ANNOUNCEMENTS_QUERY_KEY(groupId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
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
