import { ClientAPI } from "@src/ClientAPI";
import type { BaseEventPage } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse } from "@interfaces";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import {
  EVENT_PAGE_QUERY_KEY,
  SET_EVENT_PAGE_QUERY_DATA,
} from "./useGetEventPage";

export const EVENT_PAGES_QUERY_KEY = (eventId: string) => [
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

interface GetEventPagesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventPages = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetEventPagesProps): Promise<ConnectedXMResponse<BaseEventPage[]>> => {
  const clientApi = await ClientAPI(locale);
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
      SET_EVENT_PAGE_QUERY_DATA
    );
  }

  return data;
};

const useGetEventPages = (
  eventId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetEventPages>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventPages>>(
    EVENT_PAGES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventPages({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId,
    }
  );
};

export default useGetEventPages;
