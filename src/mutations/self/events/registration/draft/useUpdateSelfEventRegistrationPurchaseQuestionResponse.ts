import { ConnectedXMResponse, Registration } from "../../../../../interfaces";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "../../../../../queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "../../../../../ClientAPI";

export interface UpdateSelfEventRegistrationQuestionResponseParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questionId: number;
  value: string;
  update?: boolean;
}

export const UpdateSelfEventRegistrationQuestionResponse = async ({
  eventId,
  registrationId,
  purchaseId,
  questionId,
  value,
  update,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationQuestionResponseParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  let data;
  if (update) {
    const response = await clientApi.put<ConnectedXMResponse<Registration>>(
      `/self/events/${eventId}/registration/${registrationId}/registered/purchases/${purchaseId}/questions/${questionId}`,
      {
        value: value,
      }
    );
    data = response.data;
  } else {
    const response = await clientApi.put<ConnectedXMResponse<Registration>>(
      `/self/events/${eventId}/registration/${registrationId}/draft/purchases/${purchaseId}/questions/${questionId}`,
      {
        value: value,
      }
    );
    data = response.data;
  }

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
  }

  return data;
};

export const useUpdateSelfEventRegistrationQuestionResponse = (
  update?: boolean,
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationQuestionResponse>>,
      Omit<
        UpdateSelfEventRegistrationQuestionResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationQuestionResponseParams,
    Awaited<ReturnType<typeof UpdateSelfEventRegistrationQuestionResponse>>
  >(
    (params) =>
      UpdateSelfEventRegistrationQuestionResponse({ update, ...params }),
    options
  );
};
