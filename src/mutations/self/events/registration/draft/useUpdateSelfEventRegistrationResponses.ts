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
import { GetClientAPI } from "@src/ClientAPI";

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
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationResponsesParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/responses`,
    responses
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useUpdateSelfEventRegistrationResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>,
      Omit<
        UpdateSelfEventRegistrationResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationResponsesParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>
  >(UpdateSelfEventRegistrationResponses, options);
};
