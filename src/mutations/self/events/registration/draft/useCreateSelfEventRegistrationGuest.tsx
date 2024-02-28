import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { ConnectedXMResponse, Registration } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface CreateGuest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface CreateSelfEventRegistrationGuestParams extends MutationParams {
  eventId: string;
  registrationId: string;
  guest: CreateGuest;
}

export const CreateSelfEventRegistrationGuest = async ({
  eventId,
  registrationId,
  guest,
  clientApiParams,
  queryClient,
  locale = "en",
}: CreateSelfEventRegistrationGuestParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/guests`,
    guest
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useCreateSelfEventRegistrationGuest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfEventRegistrationGuest>>,
      Omit<
        CreateSelfEventRegistrationGuestParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfEventRegistrationGuestParams,
    Awaited<ReturnType<typeof CreateSelfEventRegistrationGuest>>
  >(CreateSelfEventRegistrationGuest, options);
};
