import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { EventMediaItem } from "@interfaces";
import { EVENT_MEDIA_ITEMS_QUERY_KEY } from "./useGetEventMediaItems";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_MEDIA_ITEM_QUERY_KEY = (
  eventId: string,
  mediaItemId: string
): QueryKey => [...EVENT_MEDIA_ITEMS_QUERY_KEY(eventId), mediaItemId];

export const SET_EVENT_IMAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_MEDIA_ITEM_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventMediaItem>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_MEDIA_ITEM_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventMediaItemProps extends SingleQueryParams {
  eventId: string;
  mediaItemId: string;
}

export const GetEventMediaItem = async ({
  eventId,
  mediaItemId,
  clientApiParams,
}: GetEventMediaItemProps): Promise<ConnectedXMResponse<EventMediaItem>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/media/${mediaItemId}`
  );
  return data;
};

export const useGetEventMediaItem = (
  eventId: string = "",
  mediaItemId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventMediaItem>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventMediaItem>>(
    EVENT_MEDIA_ITEM_QUERY_KEY(eventId, mediaItemId),
    (params) => GetEventMediaItem({ eventId, mediaItemId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!mediaItemId && (options?.enabled ?? true),
    }
  );
};
