import { ConnectedXMResponse, SurveySubmission } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_SUBMISSIONS_QUERY_KEY } from "./useGetSurveySubmissions";

export const SURVEY_SUBMISSION_QUERY_KEY = (
  surveyId: string,
  submissionId: string
): QueryKey => [
  ...SURVEY_SUBMISSIONS_QUERY_KEY(surveyId),
  "SUBMISSIONS",
  submissionId,
];

export const SET_SELF_SURVEY_SUBMISSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_SUBMISSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySubmission>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SURVEY_SUBMISSION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSurveySubmissionProps extends SingleQueryParams {
  surveyId: string;
  submissionId: string;
}

export const GetSurveySubmission = async ({
  surveyId,
  submissionId,
  clientApiParams,
}: GetSurveySubmissionProps): Promise<
  ConnectedXMResponse<SurveySubmission>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/surveys/${surveyId}/submissions/${submissionId}`
  );

  return data;
};

export const useGetSurveySubmission = (
  surveyId: string,
  submissionId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSurveySubmission>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveySubmission>>(
    SURVEY_SUBMISSION_QUERY_KEY(surveyId, submissionId),
    (params: SingleQueryParams) =>
      GetSurveySubmission({
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
