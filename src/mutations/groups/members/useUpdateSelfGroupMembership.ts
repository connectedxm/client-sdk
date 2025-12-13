import {
  GroupMembership,
  ConnectedXMResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_GROUP_MEMBERSHIP_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SelfGroupMembershipUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfGroupMembershipParams extends MutationParams {
  groupId: string;
  membership: SelfGroupMembershipUpdateInputs;
}

/**
 * @category Methods
 * @group Self
 */
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
      (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...membership,
            },
          };
        }
        return oldData;
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

/**
 * @category Mutations
 * @group Self
 */
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
