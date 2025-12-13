import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import {
  GROUP_INVITABLE_ACCOUNTS_QUERY_KEY,
  GROUP_INVITATIONS_QUERY_KEY,
} from "@src/queries";
import { GroupInvitationsCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Groups
 */
export interface CreateGroupInvitationsParams extends MutationParams {
  groupId: string;
  invitations: GroupInvitationsCreateInputs;
}

/**
 * @category Methods
 * @group Groups
 */
export const CreateGroupInvitations = async ({
  groupId,
  invitations,
  clientApiParams,
  queryClient,
}: CreateGroupInvitationsParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/groups/${groupId}/invitations`,
    invitations
  );

  if (queryClient && data.message === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITABLE_ACCOUNTS_QUERY_KEY(groupId),
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
export const useCreateGroupInvitations = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateGroupInvitations>>,
      Omit<CreateGroupInvitationsParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateGroupInvitationsParams,
    Awaited<ReturnType<typeof CreateGroupInvitations>>
  >(CreateGroupInvitations, options);
};
