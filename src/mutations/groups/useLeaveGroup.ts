import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import {
  GROUPS_QUERY_KEY,
  GROUP_QUERY_KEY,
  SELF_GROUP_MEMBERSHIPS_QUERY_KEY,
  SELF_GROUP_MEMBERSHIP_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { REMOVE_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

/**
 * @category Params
 * @group Groups
 */
export interface LeaveGroupParams extends MutationParams {
  groupId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const LeaveGroup = async ({
  groupId,
  clientApiParams,
  queryClient,
}: LeaveGroupParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/groups/${groupId}/leave`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: GROUP_QUERY_KEY(groupId),
    });
    queryClient.invalidateQueries({
      queryKey: GROUPS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_GROUP_MEMBERSHIPS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_GROUP_MEMBERSHIP_QUERY_KEY(groupId),
    });
    REMOVE_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      groupId
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useLeaveGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof LeaveGroup>>,
      Omit<LeaveGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    LeaveGroupParams,
    Awaited<ReturnType<typeof LeaveGroup>>
  >(LeaveGroup, options);
};
