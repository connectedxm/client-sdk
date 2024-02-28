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

export interface RegisterCancelledEventRegistrationParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const RegisterCancelledEventRegistration = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
  locale = "en",
}: RegisterCancelledEventRegistrationParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/cancelled/register`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
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

export const useRegisterCancelledEventRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RegisterCancelledEventRegistration>>,
      Omit<
        RegisterCancelledEventRegistrationParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RegisterCancelledEventRegistrationParams,
    Awaited<ReturnType<typeof RegisterCancelledEventRegistration>>
  >(RegisterCancelledEventRegistration, options);
};
