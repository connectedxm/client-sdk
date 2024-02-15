import { useConnectedXM } from "@src/hooks/useConnectedXM";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, Event } from "@interfaces";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { EVENT_QUERY_KEY } from "../events/useGetEvent";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_EVENTS_QUERY_KEY = (past: boolean) => [
  ...SELF_QUERY_KEY(),
  "EVENTS",
  past ? "PAST" : "UPCOMING",
];

interface GetSelfEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSelfEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  queryClient,
  clientApi,
  locale,
}: GetSelfEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const { data } = await clientApi.get(`/self/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past || false,
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

export const useGetSelfEvents = (
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfEvents>>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfEvents>>>(
    SELF_EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSelfEvents({ ...params, past }),
    params,
    {
      ...options,
      enabled: !!token && (options.enabled ?? true),
    }
  );
};
