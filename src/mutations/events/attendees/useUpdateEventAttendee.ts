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
import { EventAttendeeUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventAttendeeParams extends MutationParams {
  eventId: string;
  attendee: EventAttendeeUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventAttendee = async ({
  eventId,
  attendee,
  clientApiParams,
  queryClient,
}: UpdateEventAttendeeParams): Promise<ConnectedXMResponse<Registration>> => {
  if (queryClient) {
    queryClient.setQueryData(
      [...EVENT_REGISTRATION_QUERY_KEY(eventId), clientApiParams.locale],
      (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...attendee,
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
    attendee
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
export const useUpdateEventAttendee = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendee>>,
      Omit<UpdateEventAttendeeParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeeParams,
    Awaited<ReturnType<typeof UpdateEventAttendee>>
  >(UpdateEventAttendee, options);
};
