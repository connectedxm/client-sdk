import { GroupMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_MEMBERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface PromoteGroupMemberParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const PromoteGroupMember = async ({
  groupId,
  accountId,
  clientApiParams,
  queryClient,
}: PromoteGroupMemberParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/members/${accountId}/promote`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_MEMBERS_QUERY_KEY(groupId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const usePromoteGroupMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof PromoteGroupMember>>,
      Omit<PromoteGroupMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    PromoteGroupMemberParams,
    Awaited<ReturnType<typeof PromoteGroupMember>>
  >(PromoteGroupMember, options);
};
