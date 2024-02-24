import type { BaseEventPage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse } from "@interfaces";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { EVENT_PAGE_QUERY_KEY } from "./useGetEventPage";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_PAGES_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "PAGES",
];

export const SET_EVENT_PAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventPagesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventPages = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetEventPagesProps): Promise<ConnectedXMResponse<BaseEventPage[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/pages`, {
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
      (pageId) => EVENT_PAGE_QUERY_KEY(eventId, pageId),
      locale
    );
  }

  return data;
};

export const useGetEventPages = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventPages>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventPages>>>(
    EVENT_PAGES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventPages({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId,
    }
  );
};
