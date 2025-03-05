import {
  ConnectedXMResponse,
  SurveySection,
  SurveySubmission,
} from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../self/useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_SURVEY_SUBMISSION_QUERY_KEY = (
  surveyId: string
): QueryKey => [...SELF_QUERY_KEY(), surveyId, "SUBMISSION"];

export const SET_SELF_SURVEY_SUBMISSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_SURVEY_SUBMISSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveySubmission>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_SURVEY_SUBMISSION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSurveySubmissionProps extends SingleQueryParams {
  surveyId: string;
}

export const GetSurveySubmission = async ({
  surveyId,
  clientApiParams,
}: GetSurveySubmissionProps): Promise<
  ConnectedXMResponse<SurveySubmission & { sections: SurveySection[] }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/surveys/${surveyId}/submission`);

  return data;
};

export const useGetSurveySubmission = (
  surveyId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSurveySubmission>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurveySubmission>>(
    SELF_SURVEY_SUBMISSION_QUERY_KEY(surveyId),
    (params: SingleQueryParams) =>
      GetSurveySubmission({
        surveyId,
        ...params,
      }),
    {
      ...options,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!surveyId && (options?.enabled ?? true),
    }
  );
};
