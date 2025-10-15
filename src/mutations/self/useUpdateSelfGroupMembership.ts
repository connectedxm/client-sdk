import { GroupMembership, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_GROUP_MEMBERSHIP_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSelfGroupMembershipParams extends MutationParams {
  groupId: string;
  membership: Partial<GroupMembership>;
}

export const UpdateSelfGroupMembership = async ({
  groupId,
  membership,
  clientApiParams,
  queryClient,
}: UpdateSelfGroupMembershipParams): Promise<
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

export const useUpdateSelfGroupMembership = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfGroupMembership>>,
      Omit<UpdateSelfGroupMembershipParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfGroupMembershipParams,
    Awaited<ConnectedXMResponse<GroupMembership>>
  >(UpdateSelfGroupMembership, options);
};
