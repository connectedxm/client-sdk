import { ClientAPI } from "@src/ClientAPI";
import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LEVEL_QUERY_KEY } from "./useGetLevel";
import { QueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useQueryClient } from "wagmi";
import { SET_SPONSOR_QUERY_DATA } from "./useGetSponsor";

export const LEVEL_SPONSORS_QUERY_KEY = (levelId: string) => [
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

interface GetLevelSponsorsProps extends InfiniteQueryParams {
  levelId: string;
}

export const GetLevelSponsors = async ({
  levelId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetLevelSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/levels/${levelId}/accounts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetLevelSponsors = (levelId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<ConnectedXMResponse<Account[]>>(
    LEVEL_SPONSORS_QUERY_KEY(levelId),
    (params: InfiniteQueryParams) => GetLevelSponsors({ levelId, ...params }),
    {
      enabled: !!levelId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (levelId) => [levelId],
          SET_SPONSOR_QUERY_DATA
        ),
    }
  );
};

export default useGetLevelSponsors;
