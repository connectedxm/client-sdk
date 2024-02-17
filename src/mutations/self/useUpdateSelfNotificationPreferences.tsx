import { SELF_PREFERENCES_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, NotificationPreferences } from "@src/interfaces";

export interface UpdateSelfNotificationPreferencesParams
  extends MutationParams {
  newFollowerPush?: boolean;
  newFollowerEmail?: boolean;
  likePush?: boolean;
  resharePush?: boolean;
  commentPush?: boolean;
  transferPush?: boolean;
  transferEmail?: boolean;
  supportTicketConfirmationEmail?: boolean;
  chatPush?: boolean;
  chatUnreadPush?: boolean;
  chatUnreadEmail?: boolean;
}

export const UpdateSelfNotificationPreferences = async ({
  clientApi,
  queryClient,
  locale = "en",
  ...params
}: UpdateSelfNotificationPreferencesParams): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_PREFERENCES_QUERY_KEY(), locale],
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

  const { data } = await clientApi.put<
    ConnectedXMResponse<NotificationPreferences>
  >(`/self/notificationPreferences`, params);

  return data;
};

export const useUpdateSelfNotificationPreferences = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateSelfNotificationPreferences>>,
    UpdateSelfNotificationPreferencesParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfNotificationPreferencesParams,
    Awaited<ReturnType<typeof UpdateSelfNotificationPreferences>>
  >(UpdateSelfNotificationPreferences, params, options);
};
