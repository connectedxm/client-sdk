import type { BaseEvent } from "@interfaces";
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

export const EVENTS_QUERY_KEY = (past?: true, featured?: boolean): QueryKey => {
  const keys = ["EVENTS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  if (typeof featured !== "undefined") {
    keys.push(featured ? "FEATURED" : "ALL");
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

export interface GetEventsProps extends InfiniteQueryParams {
  past?: boolean;
  featured?: boolean;
}

export const GetEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  featured,
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
      featured: featured !== undefined ? featured : undefined,
    },
  });

  return data;
};

export const useGetEvents = (
  past?: true,
  featured?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEvents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEvents>>>(
    EVENTS_QUERY_KEY(past, featured),
    (params: InfiniteQueryParams) => GetEvents({ past, featured, ...params }),
    params,
    options
  );
};
