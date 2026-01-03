import { SELF_PREFERENCES_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  ConnectedXMResponse,
  NotificationPreferences,
  OrganizationActivityPreference,
} from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSelfNotificationPreferencesParams
  extends MutationParams {
  newFollowerPush?: boolean;
  likePush?: boolean;
  commentPush?: boolean;
  transferPush?: boolean;
  transferEmail?: boolean;
  chatPush?: boolean;
  chatUnreadPush?: boolean;
  chatUnreadEmail?: boolean;
  eventReminderEmail?: boolean;
  activityNotificationPreference?: OrganizationActivityPreference;
  organizationAnnouncementPush?: boolean;
  organizationAnnouncementEmail?: boolean;
  groupInvitationPush?: boolean;
  groupInvitationEmail?: boolean;
}

export const UpdateSelfNotificationPreferences = async ({
  clientApiParams,
  queryClient,

  ...params
}: UpdateSelfNotificationPreferencesParams): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_PREFERENCES_QUERY_KEY(), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          oldData.data = { ...oldData.data, ...params };
          return oldData;
        } else {
          return oldData;
        }
      }
    );
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<NotificationPreferences>
  >(`/self/notificationPreferences`, params);

  return data;
};

export const useUpdateSelfNotificationPreferences = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfNotificationPreferences>>,
      Omit<
        UpdateSelfNotificationPreferencesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfNotificationPreferencesParams,
    Awaited<ReturnType<typeof UpdateSelfNotificationPreferences>>
  >(UpdateSelfNotificationPreferences, options);
};
