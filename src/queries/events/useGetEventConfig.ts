import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { EventConfig } from "@interfaces";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_CONFIG_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "CONFIG",
];

export const SET_EVENT_CONFIG_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_CONFIG_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventConfig>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_CONFIG_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventConfigProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventConfig = async ({
  eventId,
  clientApiParams,
}: GetEventConfigProps): Promise<ConnectedXMResponse<EventConfig>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/config`);
  return data;
};

export const useGetEventConfig = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventConfig>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventConfig>>(
    EVENT_CONFIG_QUERY_KEY(eventId),
    (params) => GetEventConfig({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
