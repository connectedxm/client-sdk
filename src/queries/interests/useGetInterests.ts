import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { Interest } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const INTERESTS_QUERY_KEY = (): QueryKey => ["INTERESTS"];

export interface GetInterestsProps extends InfiniteQueryParams {}

export const GetInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetInterests = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetInterests>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetInterests>>>(
    INTERESTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetInterests(params),
    params,
    {
      ...options,
    }
  );
};
