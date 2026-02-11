import type { BaseSurvey } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const SURVEYS_QUERY_KEY = (eventId?: string): QueryKey => {
  const keys = ["SURVEYS"];
  if (eventId) {
    keys.push(eventId);
  }
  return keys;
};

export const SET_SURVEYS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SURVEYS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSurveys>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SURVEYS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSurveysProps extends InfiniteQueryParams {
  eventId?: string;
}

export const GetSurveys = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  clientApiParams,
}: GetSurveysProps): Promise<ConnectedXMResponse<BaseSurvey[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/surveys`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
    },
  });

  return data;
};

export const useGetSurveys = (
  eventId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSurveys>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSurveys>>>(
    SURVEYS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetSurveys({ eventId, ...params }),
    params,
    options
  );
};
