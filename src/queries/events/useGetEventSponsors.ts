import type { Account, ConnectedXMResponse } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { EVENT_TICKETS_QUERY_KEY } from "./useGetEventTickets";
import { SPONSOR_QUERY_KEY } from "../sponsors/useGetSponsor";

export const EVENT_SPONSORS_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSORS",
];

export const SET_EVENT_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventSponsorsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSponsors = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetEventSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/events/${eventId}/sponsors`, {
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
      (sponsorId) => SPONSOR_QUERY_KEY(sponsorId),
      locale
    );
  }

  return data;
};

export const useGetEventSponsors = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsors>>
  >(
    EVENT_TICKETS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSponsors({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
