import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_REGISTRATION_ADD_ONS_QUERY_KEY,
  EVENT_REGISTRATION_INTENT_QUERY_KEY,
  EVENT_REGISTRATION_QUESTIONS_QUERY_KEY,
  EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY,
} from "@src/queries/events/registration";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventRegistrationPassesParams
  extends MutationParams {
  eventId: string;
  passes: {
    id: string;
    ticketId: string;
    couponId?: string;
    packageId?: string;
  }[];
  packages: { id: string; packageId: string }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventRegistrationPasses = async ({
  eventId,
  passes,
  packages,
  clientApiParams,
  queryClient,
}: UpdateEventRegistrationPassesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/passes`,
    { passes, packages }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_ADD_ONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_ROOM_TYPES_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventRegistrationPasses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventRegistrationPasses>>,
      Omit<
        UpdateEventRegistrationPassesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventRegistrationPassesParams,
    Awaited<ReturnType<typeof UpdateEventRegistrationPasses>>
  >(UpdateEventRegistrationPasses, options);
};
