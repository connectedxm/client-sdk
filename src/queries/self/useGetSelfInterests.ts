import type { ConnectedXMResponse, Interest } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_INTERESTS_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "INTERESTS",
];

export interface GetSelfInterestsProps extends InfiniteQueryParams {}

export const GetSelfInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfInterestsProps): Promise<ConnectedXMResponse<Interest[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfInterests = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfInterests>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfInterests>>
  >(
    SELF_INTERESTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfInterests({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
