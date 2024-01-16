import { ClientAPI } from "@src/ClientAPI";
import type { Event } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { EVENT_QUERY_KEY, SET_EVENT_QUERY_DATA } from "./useGetEvent";

export const EVENTS_QUERY_KEY = (past?: boolean) => {
  const keys = ["EVENTS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  return keys;
};

export const SET_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEvents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  locale,
  queryClient,
}: GetEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
    },
  });

  if (queryClient) {
    CacheIndividualQueries(
      data,
      queryClient,
      (eventId) => EVENT_QUERY_KEY(eventId),
      SET_EVENT_QUERY_DATA
    );
  }

  return data;
};

const useGetEvents = (
  past: boolean = false,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetEvents>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEvents>>(
    EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetEvents({ past, ...params }),
    params,
    options
  );
};

export default useGetEvents;
