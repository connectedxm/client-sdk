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
  SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";

export interface UpdateSelfEventRegistrationPassesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  passes: { passId: string; passTypeId: string }[];
}

export const UpdateSelfEventRegistrationPasses = async ({
  eventId,
  registrationId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationPassesParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/cart/purchases`,
    passes
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(
        eventId,
        registrationId
      ),
    });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(false) });
    queryClient.invalidateQueries({ queryKey: SELF_EVENTS_QUERY_KEY(true) });
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
    queryClient.invalidateQueries({
      queryKey: EVENT_REGISTRANTS_QUERY_KEY(eventId),
    });
  }
  return data;
};

export const useUpdateSelfEventRegistrationPasses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationPasses>>,
      Omit<
        UpdateSelfEventRegistrationPassesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationPassesParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationPasses>>
  >(UpdateSelfEventRegistrationPasses, options);
};
