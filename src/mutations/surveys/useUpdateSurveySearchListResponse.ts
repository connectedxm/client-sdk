import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SurveySearchListResponseUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Surveys
 */
export interface UpdateSurveySearchListResponseParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  questionId: string;
  response: SurveySearchListResponseUpdateInputs;
}

/**
 * @category Methods
 * @group Surveys
 */
export const UpdateSurveySearchListResponse = async ({
  surveyId,
  submissionId,
  questionId,
  response,
  clientApiParams,
}: UpdateSurveySearchListResponseParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/submissions/${submissionId}/questions/${questionId}`,
    response
  );

  return data;
};

/**
 * @category Mutations
 * @group Surveys
 */
export const useUpdateSurveySearchListResponse = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySearchListResponse>>,
      Omit<UpdateSurveySearchListResponseParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySearchListResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSurveySearchListResponse, options);
};
