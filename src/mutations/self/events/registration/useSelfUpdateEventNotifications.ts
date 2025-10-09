import { GetClientAPI } from "@src/ClientAPI";
import {
  ActivityPreferences,
  ConnectedXMResponse,
  Registration,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface SelfUpdateEventNotificationsParams extends MutationParams {
  eventId: string;
  activityPushPreference: ActivityPreferences;
}

export const SelfUpdateEventNotifications = async ({
  eventId,
  activityPushPreference,
  clientApiParams,
  queryClient,
}: SelfUpdateEventNotificationsParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              activityPushPreference,
            },
          };
        }
        return oldData;
      }
    );
  }

  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/preferences`,
    { activityPushPreference }
  );

  return data;
};

export const useSelfUpdateEventNotifications = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SelfUpdateEventNotifications>>,
      Omit<
        SelfUpdateEventNotificationsParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SelfUpdateEventNotificationsParams,
    Awaited<ReturnType<typeof SelfUpdateEventNotifications>>
  >(SelfUpdateEventNotifications, options);
};
