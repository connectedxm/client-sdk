import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_SURVEY_SUBMISSION_QUERY_KEY } from "@src/queries/surveys/useGetSurveySubmission";

export interface UpdateSubmitSurveyParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  passes: {
    id: string;
    responses: { questionId: string; value: string }[];
  }[];
}

export const UpdateSubmitSurvey = async ({
  surveyId,
  submissionId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateSubmitSurveyParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/submissions/${submissionId}/submit`,
    passes
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_SURVEY_SUBMISSION_QUERY_KEY(surveyId),
    });
  }

  return data;
};

export const useUpdateSubmitSurvey = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSubmitSurvey>>,
      Omit<UpdateSubmitSurveyParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSubmitSurveyParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSubmitSurvey, options);
};
