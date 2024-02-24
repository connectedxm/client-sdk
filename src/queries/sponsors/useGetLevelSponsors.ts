import type { Account, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LEVEL_QUERY_KEY } from "./useGetLevel";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { SPONSOR_QUERY_KEY } from "./useGetSponsor";
import { GetClientAPI } from "@src/ClientAPI";

export const LEVEL_SPONSORS_QUERY_KEY = (levelId: string): QueryKey => [
  ...LEVEL_QUERY_KEY(levelId),
  "SPONSORS",
];

export const SET_LEVEL_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVEL_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevelSponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LEVEL_SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetLevelSponsorsProps extends InfiniteQueryParams {
  levelId: string;
}

export const GetLevelSponsors = async ({
  levelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetLevelSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/levels/${levelId}/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (sponsorId) => SPONSOR_QUERY_KEY(sponsorId),
      locale
    );
  }

  return data;
};

export const useGetLevelSponsors = (
  levelId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetLevelSponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetLevelSponsors>>
  >(
    LEVEL_SPONSORS_QUERY_KEY(levelId),
    (params: InfiniteQueryParams) => GetLevelSponsors({ levelId, ...params }),
    params,
    {
      ...options,
      enabled: !!levelId && (options?.enabled ?? true),
    }
  );
};
