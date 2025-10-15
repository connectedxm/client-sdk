import {
  GroupMembership,
  ConnectedXMResponse,
  ActivityPreference,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { SELF_GROUP_MEMBERSHIP_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSelfGroupMembershipParams extends MutationParams {
  groupId: string;
  membership?: Partial<GroupMembership>;
  activityNotificationPreference?: ActivityPreference;
  announcementPushNotification?: boolean;
  announcementEmailNotification?: boolean;
}

export const UpdateSelfGroupMembership = async ({
  groupId,
  membership,
  activityNotificationPreference,
  announcementPushNotification,
  announcementEmailNotification,
  clientApiParams,
  queryClient,
}: UpdateSelfGroupMembershipParams): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  // Prepare the update payload
  const updatePayload = {
    ...membership,
    ...(activityNotificationPreference !== undefined && {
      activityNotificationPreference,
    }),
    ...(announcementPushNotification !== undefined && {
      announcementPushNotification,
    }),
    ...(announcementEmailNotification !== undefined && {
      announcementEmailNotification,
    }),
  };

  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_GROUP_MEMBERSHIP_QUERY_KEY(groupId), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...updatePayload,
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
    updatePayload
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
