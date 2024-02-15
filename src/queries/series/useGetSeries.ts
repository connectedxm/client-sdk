import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { ConnectedXMResponse, Series } from "@interfaces";
import { SERIES_LIST_QUERY_KEY } from "./useGetSeriesList";
import { QueryClient } from "@tanstack/react-query";

export const SERIES_QUERY_KEY = (seriesId: string) => [
  ...SERIES_LIST_QUERY_KEY(),
  seriesId,
];

export const SET_SERIES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeries>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...SERIES_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

interface GetSeriesProps extends SingleQueryParams {
  seriesId: string;
}

export const GetSeries = async ({
  seriesId,
  clientApi,
}: GetSeriesProps): Promise<ConnectedXMResponse<Series>> => {
  const { data } = await clientApi.get(`/series/${seriesId}`);
  return data;
};

export const useGetSeries = (
  seriesId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSeries>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSeries>>(
    SERIES_QUERY_KEY(seriesId),
    (params) => GetSeries({ seriesId, ...params }),
    {
      ...options,
      enabled: !!seriesId && (options?.enabled ?? true),
    }
  );
};
