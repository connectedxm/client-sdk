import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import {
  BaseRegistrationGuest,
  ConnectedXMResponse,
  Registration,
} from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

export interface UpdateSelfEventRegistrationGuestParams extends MutationParams {
  eventId: string;
  registrationId: string;
  guestId: string;
  guest: BaseRegistrationGuest;
}

export const UpdateSelfEventRegistrationGuest = async ({
  eventId,
  registrationId,
  guestId,
  guest,
  clientApiParams,
  queryClient,
  locale = "en",
}: UpdateSelfEventRegistrationGuestParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/guests/${guestId}`,
    guest
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useUpdateSelfEventRegistrationGuest = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuest>>,
      Omit<
        UpdateSelfEventRegistrationGuestParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationGuestParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuest>>
  >(UpdateSelfEventRegistrationGuest, params, options);
};
