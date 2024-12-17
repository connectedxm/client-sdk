import {
  ConnectedXMResponse,
  isRegistrationQuestion,
  Registration,
  RegistrationQuestion,
  RegistrationSection,
} from "../../../../interfaces";
import {
  GetBaseSingleQueryKeys,
  SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "../../../../queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "../../../../ClientAPI";
import { produce } from "immer";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "@src/queries/self/attendee";

export interface UpdateSelfEventRegistrationQuestionResponseParams
  extends MutationParams {
  eventId: string;
  passId: string;
  questionId: number;
  value: string;
  update?: boolean;
}

export const UpdateSelfEventRegistrationQuestionResponse = async ({
  eventId,
  passId,
  questionId,
  value,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationQuestionResponseParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.put<
    ConnectedXMResponse<[Registration, string]>
  >(
    `/self/events/${eventId}/registration/passes/${passId}/questions/${questionId}`,
    {
      value: value,
    }
  );

  const response = {
    ...data,
    data: data.data[0],
  };

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], response, [
      clientApiParams.locale,
    ]);

    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        passId
      ),
    });

    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });

    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
    });

    queryClient.setQueryData(
      [
        ...SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY(
          eventId,
          passId
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
                          if (isRegistrationQuestion(subQuestion)) {
                            fillQuestionResponse(
                              subQuestion,
                              questionId,
                              data.data[1]
                            );
                          }
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
