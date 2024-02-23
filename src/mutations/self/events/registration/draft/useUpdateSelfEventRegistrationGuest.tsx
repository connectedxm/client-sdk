import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import {
  BaseRegistrationGuest,
  ConnectedXMResponse,
  Registration,
} from "@interfaces";
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
  clientApi,
  queryClient,
  locale = "en",
}: UpdateSelfEventRegistrationGuestParams): Promise<
  ConnectedXMResponse<Registration>
> => {
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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuest>>,
      Omit<UpdateSelfEventRegistrationGuestParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationGuestParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuest>>
  >(UpdateSelfEventRegistrationGuest, params, options);
};
