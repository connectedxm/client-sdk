import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, Activity } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const ACTIVITIES_QUERY_KEY = (featured?: boolean): QueryKey => {
  const key = ["ACTIVITIES"];
  if (featured) {
    key.push("FEATURED");
  }
  return key;
};

export interface GetActivitiesProps extends InfiniteQueryParams {
  featured?: boolean;
}

export const GetActivities = async ({
  featured,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetActivitiesProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/activities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      featured: featured || undefined,
    },
  });

  return data;
};

export const useGetActivities = (
  featured?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetActivities>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetActivities>>>(
    ACTIVITIES_QUERY_KEY(featured),
    (params: InfiniteQueryParams) => GetActivities({ featured, ...params }),
    params,
    options
  );
};
