import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

export interface UpdateSelfEventRegistrationResponseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  questionId: string;
  response: string;
}

export const UpdateSelfEventRegistrationResponse = async ({
  eventId,
  registrationId,
  questionId,
  response,
  clientApi,
  queryClient,
  locale = "en",
}: UpdateSelfEventRegistrationResponseParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/registered/response`,
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

export const useUpdateSelfEventRegistrationResponse = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponse>>,
      Omit<
        UpdateSelfEventRegistrationResponseParams,
        "queryClient" | "clientApi"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationResponseParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponse>>
  >(UpdateSelfEventRegistrationResponse, params, options);
};
