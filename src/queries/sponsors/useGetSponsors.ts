import { ClientAPI } from "@src/ClientAPI";
import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { SET_SPONSOR_QUERY_DATA } from "./useGetSponsor";

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
  locale,
}: GetSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
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

const useGetSponsors = () => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSponsors>>>(
    SPONSORS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSponsors({ ...params }),
    {
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (accountId) => [accountId],
          SET_SPONSOR_QUERY_DATA
        ),
    }
  );
};

export default useGetSponsors;
