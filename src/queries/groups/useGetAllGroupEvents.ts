import type { Event } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENTS_QUERY_KEY } from "../events";

export const ALL_GROUP_EVENTS = (past?: true): QueryKey => [
  ...EVENTS_QUERY_KEY(past),
  "GROUPS_EVENTS",
];

export const SET_ALL_GROUP_EVENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ALL_GROUP_EVENTS>,
  response: Awaited<ReturnType<typeof GetAllGroupEvents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...ALL_GROUP_EVENTS(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetAllGroupEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetAllGroupEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  clientApiParams,
}: GetAllGroupEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/events`, {
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

export const useGetAllGroupEvents = (
  past?: true,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAllGroupEvents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAllGroupEvents>>
  >(
    ALL_GROUP_EVENTS(past),
    (params: InfiniteQueryParams) => GetAllGroupEvents({ past, ...params }),
    params,
    options
  );
};
