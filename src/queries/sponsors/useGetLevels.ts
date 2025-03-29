import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, SponsorshipLevel } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const LEVELS_QUERY_KEY = (): QueryKey => ["LEVELS"];

export interface GetLevelsProps extends InfiniteQueryParams {}

export const GetLevels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetLevelsProps): Promise<ConnectedXMResponse<SponsorshipLevel[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/levels`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetLevels = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetLevels>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLevels>>>(
    LEVELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetLevels(params),
    params,
    options
  );
};
