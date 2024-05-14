import type {
  ConnectedXMResponse,
  Event,
  EventWithSessions,
  EventWithSpeakers,
  EventWithSponsors,
} from "@interfaces";
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

type Include = "sessions" | "speakers" | "sponsors";

export const SERIES_EVENTS_QUERY_KEY = (
  seriesId: string,
  past?: boolean,
  include?: Include
): QueryKey => {
  const keys = [...SERIES_QUERY_KEY(seriesId), "EVENTS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  if (include) {
    keys.push(include);
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
  include?: Include;
}

export const GetSeriesEvents = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  include,
  queryClient,
  clientApiParams,
  locale,
}: GetSeriesEventsProps): Promise<
  ConnectedXMResponse<
    (Event | EventWithSessions | EventWithSpeakers | EventWithSponsors)[]
  >
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/series/${seriesId}/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
      include: include || undefined,
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

  if (include === "sessions") {
    return data as ConnectedXMResponse<EventWithSessions[]>;
  } else if (include === "speakers") {
    return data as ConnectedXMResponse<EventWithSpeakers[]>;
  } else if (include === "sponsors") {
    return data as ConnectedXMResponse<EventWithSponsors[]>;
  } else {
    return data as ConnectedXMResponse<Event[]>;
  }
};

export const useGetSeriesEvents = (
  seriesId: string = "",
  past?: boolean,
  include?: Include,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesEvents>>>(
    SERIES_EVENTS_QUERY_KEY(seriesId, past, include),
    (params: InfiniteQueryParams) =>
      GetSeriesEvents({ seriesId, past, ...params }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options?.enabled ?? true),
    }
  );
};
