import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_INVITABLE_ACCOUNTS_QUERY_KEY } from "@src/queries";

export interface CreateGroupInvitationsParams extends MutationParams {
  groupId: string;
  accountIds: string[];
}

export const CreateGroupInvitations = async ({
  groupId,
  accountIds,
  clientApiParams,
  queryClient,
}: CreateGroupInvitationsParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/groups/${groupId}/invites`,
    {
      accountIds,
    }
  );

  if (queryClient && data.message === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_INVITABLE_ACCOUNTS_QUERY_KEY(groupId),
    });
  }

  return data;
};

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
