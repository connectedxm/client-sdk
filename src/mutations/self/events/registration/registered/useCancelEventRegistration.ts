import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_QUERY_KEY,
  EVENT_REGISTRANTS_QUERY_KEY,
  SELF_EVENTS_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface CancelEventRegistrationParams extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const CancelEventRegistration = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
}: CancelEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/registered/cancel`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENTS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useCancelEventRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelEventRegistration>>,
      Omit<CancelEventRegistrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelEventRegistrationParams,
    Awaited<ReturnType<typeof CancelEventRegistration>>
  >(CancelEventRegistration, options);
};
