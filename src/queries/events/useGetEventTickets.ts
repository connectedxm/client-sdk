import type { ConnectedXMResponse, Ticket } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient } from "@tanstack/react-query";

export const EVENT_TICKETS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "TICKETS",
];

export const SET_EVENT_TICKETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTickets>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_TICKETS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventTicketsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventTickets = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetEventTicketsProps): Promise<ConnectedXMResponse<Ticket[]>> => {
  const { data } = await clientApi.get(`/events/${eventId}/tickets`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventTickets = (
  eventId: string,
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetEventTickets>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetEventTickets>>(
    EVENT_TICKETS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventTickets({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventTickets;
