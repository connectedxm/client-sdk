import { ConnectedXMResponse, SurveySection } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_SUBMISSION_QUERY_KEY } from "./useGetSurveySubmission";

export const SURVEY_SUBMISSION_SECTIONS_QUERY_KEY = (
  surveyId: string,
  submissionId: string
): QueryKey => [
  ...SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId),
  "SECTIONS",
];

export interface GetSurveySubmissionSectionsProps extends SingleQueryParams {
  surveyId: string;
  submissionId: string;
}

export const GetSurveySubmissionSections = async ({
  surveyId,
  submissionId,
  clientApiParams,
}: GetSurveySubmissionSectionsProps): Promise<
  ConnectedXMResponse<SurveySection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/surveys/${surveyId}/submissions/${submissionId}/sections`
  );

  return data;
};

export const useGetSurveySubmissionSections = (
  surveyId: string,
  submissionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSurveySubmissionSections>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetSurveySubmissionSections>
  >(
    SURVEY_SUBMISSION_SECTIONS_QUERY_KEY(surveyId, submissionId),
    (params: SingleQueryParams) =>
      GetSurveySubmissionSections({
        surveyId,
        submissionId,
        ...params,
      }),
    {
      ...options,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!surveyId && !!submissionId && (options?.enabled ?? true),
    }
  );
};
