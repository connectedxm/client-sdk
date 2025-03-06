import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_SUBMISSION_QUERY_KEY } from "@src/queries";

export interface SubmitSurveyParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  responses: { questionId: string; value: string }[];
}

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
