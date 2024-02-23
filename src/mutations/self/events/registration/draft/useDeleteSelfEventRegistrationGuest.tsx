import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

export interface DeleteSelfEventRegistrationGuestParams extends MutationParams {
  eventId: string;
  registrationId: string;
  guestId: string;
}

export const DeleteSelfEventRegistrationGuest = async ({
  eventId,
  registrationId,
  guestId,
  clientApi,
  queryClient,
  locale = "en",
}: DeleteSelfEventRegistrationGuestParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/guests/${guestId}`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useDeleteSelfEventRegistrationGuest = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelfEventRegistrationGuest>>,
      Omit<DeleteSelfEventRegistrationGuestParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfEventRegistrationGuestParams,
    Awaited<ReturnType<typeof DeleteSelfEventRegistrationGuest>>
  >(DeleteSelfEventRegistrationGuest, params, options);
};
