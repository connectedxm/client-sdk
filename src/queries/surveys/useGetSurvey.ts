import { ConnectedXMResponse, Survey } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SURVEY_QUERY_KEY = (surveyId: string): QueryKey => [
  "SURVEYS",
  surveyId,
];

export interface GetSurveyProps extends SingleQueryParams {
  surveyId: string;
}

export const GetSurvey = async ({
  surveyId,
  clientApiParams,
}: GetSurveyProps): Promise<ConnectedXMResponse<Survey>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/surveys/${surveyId}`);

  return data;
};

export const useGetSurvey = (
  surveyId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSurvey>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurvey>>(
    SURVEY_QUERY_KEY(surveyId),
    (params: SingleQueryParams) =>
      GetSurvey({
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
