import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, SponsorshipLevel } from "@interfaces";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { LEVEL_QUERY_KEY } from "./useGetLevel";

export const LEVELS_QUERY_KEY = () => ["LEVELS"];

export const SET_LEVELS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVELS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevels>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LEVELS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetLevelsProps extends InfiniteQueryParams {}

export const GetLevels = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetLevelsProps): Promise<ConnectedXMResponse<SponsorshipLevel[]>> => {
  const { data } = await clientApi.get(`/levels`, {
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
      (levelId) => LEVEL_QUERY_KEY(levelId),
      locale
    );
  }

  return data;
};

const useGetLevels = (
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetLevels>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLevels>>>(
    LEVELS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetLevels(params),
    params,
    options
  );
};

export default useGetLevels;
