import type { PurchaseStatus, SearchListValue } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { SURVEY_QUERY_KEY } from "./useGetSurvey";
import { useConnected } from "@src/hooks";
import { SELF_QUERY_KEY } from "../self";

export const SURVEY_SUBMISSIONS_QUERY_KEY = (
  surveyId: string,
  status?: keyof typeof PurchaseStatus
) => {
  const key = [
    ...SELF_QUERY_KEY(),
    ...SURVEY_QUERY_KEY(surveyId),
    "SUBMISSIONS",
  ];

  if (status) key.push(status);

  return key;
};

export interface GetSurveySubmissionsProps extends InfiniteQueryParams {
  surveyId: string;
  status?: keyof typeof PurchaseStatus;
}

export const GetSurveySubmissions = async ({
  surveyId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSurveySubmissionsProps): Promise<
  ConnectedXMResponse<SearchListValue[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/surveys/${surveyId}/submissions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};

export const useGetSurveySubmissions = (
  surveyId: string = "",
  status?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  > = {}
) => {
  const { authenticated } = useConnected();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSurveySubmissions>>
  >(
    SURVEY_SUBMISSIONS_QUERY_KEY(surveyId, status),
    (params: InfiniteQueryParams) =>
      GetSurveySubmissions({
        surveyId,
        status,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!surveyId && (options?.enabled ?? true),
    }
  );
};
