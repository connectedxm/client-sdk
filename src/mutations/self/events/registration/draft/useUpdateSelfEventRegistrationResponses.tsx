import {
  BaseRegistrationQuestionResponse,
  ConnectedXMResponse,
  Registration,
} from "../../../../../interfaces";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "../../../../../queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>,
      Omit<
        UpdateSelfEventRegistrationResponsesParams,
        "queryClient" | "clientApi"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationResponsesParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>
  >(UpdateSelfEventRegistrationResponses, params, options);
};