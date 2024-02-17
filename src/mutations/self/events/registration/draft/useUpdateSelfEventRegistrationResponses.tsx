import {
  BaseRegistrationQuestionResponse,
  ConnectedXMResponse,
  Registration,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

export interface UpdateSelfEventRegistrationResponsesParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  responses: BaseRegistrationQuestionResponse[];
}

export const UpdateSelfEventRegistrationResponses = async ({
  eventId,
  registrationId,
  responses,
  clientApi,
  queryClient,
  locale = "en",
}: UpdateSelfEventRegistrationResponsesParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/responses`,
    responses
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useUpdateSelfEventRegistrationResponses = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>,
    UpdateSelfEventRegistrationResponsesParams
  >
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationResponsesParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>
  >(UpdateSelfEventRegistrationResponses, params, options);
};
