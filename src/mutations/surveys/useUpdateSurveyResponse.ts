import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Surveys
 */
export interface UpdateSurveyResponseParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  questionId: string;
  response: string;
}

/**
 * @category Methods
 * @group Surveys
 */
export const UpdateSurveyResponse = async ({
  surveyId,
  submissionId,
  questionId,
  response,
  clientApiParams,
}: UpdateSurveyResponseParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/submissions/${submissionId}/questions/${questionId}`,
    { response }
  );

  return data;
};

/**
 * @category Mutations
 * @group Surveys
 */
export const useUpdateSurveyResponse = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSurveyResponse>>,
      Omit<UpdateSurveyResponseParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveyResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSurveyResponse, options);
};
