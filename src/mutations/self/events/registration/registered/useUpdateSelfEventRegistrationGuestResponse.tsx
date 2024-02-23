import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { ConnectedXMResponse, Registration } from "@interfaces";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

export interface UpdateSelfEventRegistrationGuestResponseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  questionId: string;
  guestId: string;
  response: string;
}

export const UpdateSelfEventRegistrationGuestResponse = async ({
  eventId,
  registrationId,
  questionId,
  guestId,
  response,
  clientApi,
  queryClient,
  locale = "en",
}: UpdateSelfEventRegistrationGuestResponseParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/registered/guests/${guestId}/response`,
    {
      response,
    },
    {
      params: {
        questionId,
      },
    }
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useUpdateSelfEventRegistrationGuestResponse = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuestResponse>>,
      Omit<
        UpdateSelfEventRegistrationGuestResponseParams,
        "queryClient" | "clientApi"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationGuestResponseParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationGuestResponse>>
  >(UpdateSelfEventRegistrationGuestResponse, params, options);
};
