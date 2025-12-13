import { GroupMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_MEMBERS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Groups
 */
export interface DemoteGroupModeratorParams extends MutationParams {
  groupId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const DemoteGroupModerator = async ({
  groupId,
  accountId,
  clientApiParams,
  queryClient,
}: DemoteGroupModeratorParams): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/members/${accountId}/demote`
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
export const useDemoteGroupModerator = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DemoteGroupModerator>>,
      Omit<DemoteGroupModeratorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DemoteGroupModeratorParams,
    Awaited<ReturnType<typeof DemoteGroupModerator>>
  >(DemoteGroupModerator, options);
};
