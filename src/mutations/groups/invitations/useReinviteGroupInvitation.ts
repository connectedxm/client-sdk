import { ConnectedXMResponse, GroupInvitation } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_INVITATIONS_QUERY_KEY,
  GROUP_REQUESTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface ReinviteGroupInvitationParams extends MutationParams {
  groupId: string;
  invitationId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const ReinviteGroupInvitation = async ({
  groupId,
  invitationId,
  clientApiParams,
  queryClient,
}: ReinviteGroupInvitationParams): Promise<
  ConnectedXMResponse<GroupInvitation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupInvitation>>(
    `/groups/${groupId}/invitations/${invitationId}/reinvite`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_REQUESTS_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITATIONS_QUERY_KEY(groupId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useReinviteGroupInvitation = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof ReinviteGroupInvitation>>,
      Omit<ReinviteGroupInvitationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReinviteGroupInvitationParams,
    Awaited<ReturnType<typeof ReinviteGroupInvitation>>
  >(ReinviteGroupInvitation, options);
};
