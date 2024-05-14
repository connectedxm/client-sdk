import type { ConnectedXMResponse, Event } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { EVENT_QUERY_KEY } from "../events/useGetEvent";
import { SERIES_QUERY_KEY } from "./useGetSeries";
import { GetClientAPI } from "@src/ClientAPI";

export const SERIES_EVENTS_QUERY_KEY = (
  seriesId: string,
  past?: boolean
): QueryKey => {
  const keys = [...SERIES_QUERY_KEY(seriesId), "EVENTS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  return keys;
};

export const SET_SERIES_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesEvents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SERIES_EVENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetSeriesEventsProps extends InfiniteQueryParams {
  seriesId: string;
  past?: boolean;
}

export const GetSeriesEvents = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  queryClient,
  clientApiParams,
  locale,
}: GetSeriesEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/series/${seriesId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (eventId) => EVENT_QUERY_KEY(eventId),
      locale
    );
  }

  return data;
};

export const useGetSeriesEvents = (
  seriesId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesEvents>>>(
    SERIES_EVENTS_QUERY_KEY(seriesId),
    (params: InfiniteQueryParams) => GetSeriesEvents({ seriesId, ...params }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options?.enabled ?? true),
    }
  );
};
