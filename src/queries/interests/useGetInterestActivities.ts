import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { INTEREST_QUERY_KEY } from "./useGetInterest";
import { ACTIVITY_QUERY_KEY } from "../activities/useGetActivity";
import { GetClientAPI } from "@src/ClientAPI";
import { ACTIVITIES_QUERY_KEY } from "../activities";

export const INTEREST_ACTIVITIES_QUERY_KEY = (interest: string): QueryKey => [
  ...ACTIVITIES_QUERY_KEY(),
  ...INTEREST_QUERY_KEY(interest),
];

export interface GetInterestActivitiesProps extends InfiniteQueryParams {
  interest: string;
}

export const GetInterestActivities = async ({
  interest,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetInterestActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/interests/${interest}/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetInterestActivities = (
  interest: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetInterestActivities>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetInterestActivities>>
  >(
    INTEREST_ACTIVITIES_QUERY_KEY(interest),
    (params: InfiniteQueryParams) =>
      GetInterestActivities({ interest, ...params }),
    params,
    {
      ...options,
      enabled: !!interest && (options?.enabled ?? true),
    }
  );
};
