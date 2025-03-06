import { ConnectedXMResponse, Survey } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SURVEY_QUERY_KEY = (surveyId: string): QueryKey => [
  "SURVEYS",
  surveyId,
];

export const SET_SURVEY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurvey>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...SURVEY_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

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
