import {
  ConnectedXMResponse,
  Registration,
  RegistrationQuestion,
  RegistrationSection,
} from "../../../../../interfaces";
import {
  GetBaseSingleQueryKeys,
  SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "../../../../../queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { GetClientAPI } from "../../../../../ClientAPI";
import { produce } from "immer";

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
    const response = await clientApi.put<
      ConnectedXMResponse<[Registration, string]>
    >(
      `/self/events/${eventId}/registration/${registrationId}/registered/purchases/${purchaseId}/questions/${questionId}`,
      {
        value: value,
      }
    );
    data = response.data;
  } else {
    const response = await clientApi.put<
      ConnectedXMResponse<[Registration, string]>
    >(
      `/self/events/${eventId}/registration/${registrationId}/draft/purchases/${purchaseId}/questions/${questionId}`,
      {
        value: value,
      }
    );
    data = response.data;
  }

  const response = {
    ...data,
    data: data.data[0],
  };

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], response, [
      clientApiParams.locale,
    ]);

    queryClient.setQueryData(
      [
        ...SELF_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
          eventId,
          registrationId,
          purchaseId
        ),
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
      ],
      (oldData: ConnectedXMResponse<RegistrationSection[]>) => {
        if (oldData.data) {
          return produce(oldData, (draft) => {
            draft.data.forEach((section) => {
              section.questions.forEach((question) => {
                // This is a recursive function that will fill the response of the question and its subquestions
                const fillQuestionResponse = (
                  question: RegistrationQuestion,
                  questionId: number,
                  value: string
                ) => {
                  if (question.id === questionId) {
                    question.response = value;
                  }
                  if (question.choices.length > 0) {
                    question.choices.forEach((choice) => {
                      if (choice.subQuestions.length > 0) {
                        choice.subQuestions.forEach((subQuestion) => {
                          fillQuestionResponse(
                            subQuestion,
                            questionId,
                            data.data[1]
                          );
                        });
                      }
                    });
                  }
                };

                fillQuestionResponse(question, questionId, data.data[1]);
              });
            });
          });
        }
        return oldData;
      }
    );
  }

  return response;
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
