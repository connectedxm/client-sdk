import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_SUBMISSION_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Surveys
 */
export interface SubmitSurveyParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  responses: { questionId: string; value: string }[];
}

/**
 * @category Methods
 * @group Surveys
 */
export const SubmitSurvey = async ({
  surveyId,
  submissionId,
  responses,
  clientApiParams,
  queryClient,
}: SubmitSurveyParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/submissions/${submissionId}/submit`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Surveys
 */
export const useSubmitSurvey = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SubmitSurvey>>,
      Omit<SubmitSurveyParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SubmitSurveyParams,
    Awaited<ConnectedXMResponse<null>>
  >(SubmitSurvey, options);
};
