import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_QUERY_KEY,
  EVENT_ATTENDEE_QUERY_KEY,
} from "@src/queries";
import { EventPreferencesUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventPreferencesParams extends MutationParams {
  eventId: string;
  preferences: EventPreferencesUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventPreferences = async ({
  eventId,
  preferences,
  clientApiParams,
  queryClient,
}: UpdateEventPreferencesParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_REGISTRATION_QUERY_KEY(eventId), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...preferences,
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
    preferences
  );

  // Invalidate the attendee query to ensure UI updates
  if (queryClient) {
    queryClient.invalidateQueries({
      queryKey: [...EVENT_ATTENDEE_QUERY_KEY(eventId), clientApiParams.locale],
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventPreferences = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventPreferences>>,
      Omit<UpdateEventPreferencesParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventPreferencesParams,
    Awaited<ReturnType<typeof UpdateEventPreferences>>
  >(UpdateEventPreferences, options);
};
