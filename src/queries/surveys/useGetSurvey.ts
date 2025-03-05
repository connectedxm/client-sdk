import { ConnectedXMResponse, Survey } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_SURVEY_QUERY_KEY = (surveyId: string): QueryKey => [
  "SURVEYS",
  surveyId,
];

export const SET_SELF_SURVEY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_SURVEY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurvey>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_SURVEY_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSurveyProps extends SingleQueryParams {
  surveyId: string;
}

export const GetSurvey = async ({
  surveyId,
  clientApiParams,
}: GetSurveyProps): Promise<
  ConnectedXMResponse<Survey & { _count?: { submissions: number } }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/surveys/${surveyId}/submission`);

  return data;
};

export const useGetSurvey = (
  surveyId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSurvey>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSurvey>>(
    SELF_SURVEY_QUERY_KEY(surveyId),
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
