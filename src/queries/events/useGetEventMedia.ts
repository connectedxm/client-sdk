import { Activity } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_MEDIA_QUERY_KEY = (
  eventId: string,
  type?: "images" | "videos"
): QueryKey => [...EVENT_QUERY_KEY(eventId), "MEDIA", type || "all"];

export interface GetEventMediaProps extends InfiniteQueryParams {
  eventId: string;
  type?: "images" | "videos";
}

export const GetEventMedia = async ({
  eventId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventMediaProps): Promise<ConnectedXMResponse<Activity[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/media`, {
    params: {
      type: type || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventMedia = (
  eventId: string = "",
  type?: "images" | "videos",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventMedia>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventMedia>>>(
    EVENT_MEDIA_QUERY_KEY(eventId, type),
    (params: InfiniteQueryParams) =>
      GetEventMedia({ eventId, type, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
