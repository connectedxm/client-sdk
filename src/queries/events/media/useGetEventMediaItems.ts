import type { EventMediaItem } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_MEDIA_ITEMS_QUERY_KEY = (
  eventId: string,
  type?: string
): QueryKey => {
  const key = [...EVENT_QUERY_KEY(eventId), "MEDIA_ITEMS"];
  if (type) {
    key.push(type);
  }
  return key;
};

export const SET_EVENT_MEDIA_ITEMS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEMS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItems>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_MEDIA_ITEMS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetEventMediaItemsProps extends InfiniteQueryParams {
  eventId: string;
  type?: "image" | "video" | "file";
}

export const GetEventMediaItems = async ({
  eventId,
  type,
  pageParam,
  orderBy,
  search,
  clientApiParams,
}: GetEventMediaItemsProps): Promise<ConnectedXMResponse<EventMediaItem[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/media`, {
    params: {
      page: pageParam || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type: type || undefined,
    },
  });
  return data;
};

export const useGetEventMediaItems = (
  eventId: string = "",
  type?: "image" | "video" | "file",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventMediaItems>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventMediaItems>>
  >(
    EVENT_MEDIA_ITEMS_QUERY_KEY(eventId, type),
    (params: InfiniteQueryParams) =>
      GetEventMediaItems({ eventId, type, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
