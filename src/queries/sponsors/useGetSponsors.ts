import type { Account, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const SPONSORS_QUERY_KEY = () => ["SPONSORS"];

export const SET_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetSponsorsProps extends InfiniteQueryParams {}

export const GetSponsors = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSponsors = (
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSponsors>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSponsors>>>(
    SPONSORS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSponsors({ ...params }),
    params,
    options
  );
};

export default useGetSponsors;
