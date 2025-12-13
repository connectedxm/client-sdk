import { GroupMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import {
  GROUPS_QUERY_KEY,
  GROUP_QUERY_KEY,
  SELF_GROUP_MEMBERSHIPS_QUERY_KEY,
  SELF_GROUP_MEMBERSHIP_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

/**
 * @category Params
 * @group Groups
 */
export interface JoinGroupParams extends MutationParams {
  groupId: string;
}

/**
 * @category Methods
 * @group Groups
 */
export const JoinGroup = async ({
  groupId,
  clientApiParams,
  queryClient,
}: JoinGroupParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<GroupMembership>>(
    `/groups/${groupId}/join`
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
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "groups",
      groupId,
      "member"
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Groups
 */
export const useJoinGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof JoinGroup>>,
      Omit<JoinGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    JoinGroupParams,
    Awaited<ReturnType<typeof JoinGroup>>
  >(JoinGroup, options);
};
