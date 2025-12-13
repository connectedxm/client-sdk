import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, Event } from "@interfaces";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_EVENTS_QUERY_KEY = (past: boolean): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENTS",
  past ? "PAST" : "UPCOMING",
];

export interface GetSelfEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSelfEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  clientApiParams,
}: GetSelfEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past || false,
    },
  });

  return data;
};

export const useGetSelfEvents = (
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetSelfEvents>>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfEvents>>>(
    SELF_EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSelfEvents({ ...params, past }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
