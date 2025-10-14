import { GetClientAPI } from "@src/ClientAPI";
import {
  ActivityPreference,
  ConnectedXMResponse,
  GroupMembership,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_GROUP_MEMBERSHIP_QUERY_KEY } from "@src/queries";

export interface UpdateSelfGroupMembershipNotificationsParams
  extends MutationParams {
  groupId: string;
  activityNotificationPreference?: ActivityPreference;
  announcementPushNotification?: boolean;
  announcementEmailNotification?: boolean;
}

export const UpdateSelfGroupMembershipNotifications = async ({
  groupId,
  activityNotificationPreference,
  announcementPushNotification,
  announcementEmailNotification,
  clientApiParams,
  queryClient,
}: UpdateSelfGroupMembershipNotificationsParams): Promise<
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
              activityNotificationPreference,
              announcementPushNotification,
              announcementEmailNotification,
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
    {
      activityNotificationPreference,
      announcementPushNotification,
      announcementEmailNotification,
    }
  );

  return data;
};

export const useUpdateSelfGroupMembershipNotifications = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfGroupMembershipNotifications>>,
      Omit<
        UpdateSelfGroupMembershipNotificationsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfGroupMembershipNotificationsParams,
    Awaited<ReturnType<typeof UpdateSelfGroupMembershipNotifications>>
  >(UpdateSelfGroupMembershipNotifications, options);
};
