import { SELF_PREFERENCES_QUERY_KEY } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  ConnectedXMResponse,
  NotificationPreferences,
} from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SelfNotificationPreferencesUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfNotificationPreferencesParams extends MutationParams {
  preferences: SelfNotificationPreferencesUpdateInputs;
}

/**
 * @category Methods
 * @group Self
 */
export const UpdateSelfNotificationPreferences = async ({
  preferences,
  clientApiParams,
  queryClient,
}: UpdateSelfNotificationPreferencesParams): Promise<
  ConnectedXMResponse<NotificationPreferences>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_PREFERENCES_QUERY_KEY(), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          oldData.data = { ...oldData.data, ...preferences };
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
  >(`/self/notificationPreferences`, preferences);

  return data;
};

/**
 * @category Mutations
 * @group Self
 */
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
