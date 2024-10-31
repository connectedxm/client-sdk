import { GroupMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_GROUP_MEMBERSHIP_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { GroupMembershipUpdateInputs } from "@src/params";

export interface SelfUpdateGroupMembershipParams extends MutationParams {
  groupId: string;
  membership: Partial<GroupMembershipUpdateInputs>;
}

export const SelfUpdateGroupMembership = async ({
  groupId,
  membership,
  clientApiParams,
  queryClient,
}: SelfUpdateGroupMembershipParams): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_GROUP_MEMBERSHIP_QUERY_KEY(groupId), clientApiParams.locale],
      (data: any) => {
        return {
          ...data,
          data: {
            ...data.data,
            ...membership,
          },
        };
      }
    );
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<GroupMembership>>(
    `/self/groups/${groupId}`,
    membership
  );

  return data;
};

export const useSelfUpdateGroupMembership = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfUpdateGroupMembership>>,
      Omit<SelfUpdateGroupMembershipParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfUpdateGroupMembershipParams,
    Awaited<ConnectedXMResponse<GroupMembership>>
  >(SelfUpdateGroupMembership, options);
};
