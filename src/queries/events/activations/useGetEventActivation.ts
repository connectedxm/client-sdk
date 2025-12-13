import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";

import type { EventActivation } from "@interfaces";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "./useGetEventActivations";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ACTIVATION_QUERY_KEY = (
  eventId: string,
  passId: string,
  activationId: string
): QueryKey => [...EVENT_ACTIVATIONS_QUERY_KEY(eventId, passId), activationId];

export const SET_EVENT_ACTIVATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ACTIVATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventActivation>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ACTIVATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventActivationProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  activationId: string;
}

export const GetEventActivation = async ({
  eventId,
  passId,
  activationId,
  clientApiParams,
}: GetEventActivationProps): Promise<ConnectedXMResponse<EventActivation>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/${passId}/${activationId}`
  );
  return data;
};

export const useGetEventActivation = (
  eventId: string = "",
  passId: string = "",
  activationId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventActivation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventActivation>>(
    EVENT_ACTIVATION_QUERY_KEY(eventId, passId, activationId),
    (params) =>
      GetEventActivation({ eventId, passId, activationId, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!passId && !!activationId && (options?.enabled ?? true),
    }
  );
};
