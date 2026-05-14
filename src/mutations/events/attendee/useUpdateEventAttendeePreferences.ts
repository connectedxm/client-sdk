import { GetClientAPI } from "@src/ClientAPI";
import {
  ActivityPreference,
  ConnectedXMResponse,
  Registration,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_ATTENDEE_QUERY_KEY } from "@src/queries";

export interface UpdateEventAttendeePreferencesParams extends MutationParams {
  eventId: string;
  activityNotificationPreference?: ActivityPreference;
  announcementPushNotification?: boolean;
  announcementEmailNotification?: boolean;
}

export const UpdateEventAttendeePreferences = async ({
  eventId,
  activityNotificationPreference,
  announcementPushNotification,
  announcementEmailNotification,
  clientApiParams,
  queryClient,
}: UpdateEventAttendeePreferencesParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_ATTENDEE_QUERY_KEY(eventId), clientApiParams.locale],
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
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/preferences`,
    {
      activityNotificationPreference,
      announcementPushNotification,
      announcementEmailNotification,
    }
  );

  // Invalidate the attendee query to ensure UI updates
  if (queryClient) {
    queryClient.invalidateQueries({
      queryKey: [
        ...EVENT_ATTENDEE_QUERY_KEY(eventId),
        clientApiParams.locale,
      ],
    });
  }

  return data;
};

export const useUpdateEventAttendeePreferences = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeePreferences>>,
      Omit<
        UpdateEventAttendeePreferencesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeePreferencesParams,
    Awaited<ReturnType<typeof UpdateEventAttendeePreferences>>
  >(UpdateEventAttendeePreferences, options);
};
