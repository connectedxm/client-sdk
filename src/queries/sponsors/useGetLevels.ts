import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SponsorshipLevel } from "@interfaces";

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
  locale,
}: GetLevelsProps): Promise<ConnectedXMResponse<SponsorshipLevel[]>> => {
  const clientApi = await ClientAPI(locale);
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

const useGetLevels = () => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLevels>>>(
    LEVELS_QUERY_KEY(),
    (params: any) => GetLevels(params)
  );
};

export default useGetLevels;
