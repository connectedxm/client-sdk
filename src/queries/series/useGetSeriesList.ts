import { ClientAPI } from "@src/ClientAPI";
import type { Series } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SET_SERIES_QUERY_DATA } from "./useGetSeries";

export const SERIES_LIST_QUERY_KEY = (past?: boolean) => {
  let keys = ["SERIES"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  return keys;
};

export const SET_SERIES_LIST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_LIST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesList>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SERIES_LIST_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetSeriesListProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSeriesList = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  locale,
}: GetSeriesListProps): Promise<ConnectedXMResponse<Series[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/series`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
    },
  });
  return data;
};

const useGetSeriesList = (past?: boolean) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesList>>>(
    SERIES_LIST_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSeriesList({ past, ...params }),
    {
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (seriesId) => [seriesId],
          SET_SERIES_QUERY_DATA
        ),
    }
  );
};

export default useGetSeriesList;
