import type { BaseEvent } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENTS_QUERY_KEY = (past?: boolean): QueryKey => {
  const keys = ["EVENTS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  return keys;
};

export interface GetEventsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  clientApiParams,
}: GetEventsProps): Promise<ConnectedXMResponse<BaseEvent[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events`, {
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

export const useGetEvents = (
  past: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEvents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEvents>>>(
    EVENTS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetEvents({ past, ...params }),
    params,
    options
  );
};
