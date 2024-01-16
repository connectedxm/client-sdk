import { ClientAPI } from "@src/ClientAPI";
import type { ConnectedXMResponse, Event } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { EVENT_QUERY_KEY, SET_EVENT_QUERY_DATA } from "../events/useGetEvent";
import { SERIES_QUERY_KEY } from "./useGetSeries";

export const SERIES_EVENTS_QUERY_KEY = (seriesId: string) => [
  ...SERIES_QUERY_KEY(seriesId),
  "EVENTS",
];

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

interface GetSeriesEventsProps extends InfiniteQueryParams {
  seriesId: string;
}

export const GetSeriesEvents = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetSeriesEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/series/${seriesId}/events`, {
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
      (eventId) => EVENT_QUERY_KEY(eventId),
      SET_EVENT_QUERY_DATA
    );
  }

  return data;
};

const useGetSeriesEvents = (
  seriesId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetSeriesEvents>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetSeriesEvents>>(
    SERIES_EVENTS_QUERY_KEY(seriesId),
    (params: InfiniteQueryParams) => GetSeriesEvents({ seriesId, ...params }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options?.enabled ?? true),
    }
  );
};

export default useGetSeriesEvents;
