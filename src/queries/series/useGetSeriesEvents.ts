import type { ConnectedXMResponse, Event } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
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
  clientApiParams,
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

  return data;
};

export const useGetSeriesEvents = (
  seriesId: string = "",
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSeriesEvents>>>(
    SERIES_EVENTS_QUERY_KEY(seriesId, past),
    (params: InfiniteQueryParams) =>
      GetSeriesEvents({ seriesId, past, ...params }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options?.enabled ?? true),
    }
  );
};
