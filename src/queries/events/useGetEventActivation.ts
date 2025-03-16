import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { EventActivation } from "@interfaces";
import { EVENT_ACTIVATIONS_QUERY_KEY } from "./useGetEventActivations";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ACTIVATION_QUERY_KEY = (
  eventId: string,
  activationId: string
): QueryKey => [...EVENT_ACTIVATIONS_QUERY_KEY(eventId), activationId];

export interface GetEventActivationProps extends SingleQueryParams {
  eventId: string;
  activationId: string;
}

export const GetEventActivation = async ({
  eventId,
  activationId,
  clientApiParams,
}: GetEventActivationProps): Promise<ConnectedXMResponse<EventActivation>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/${activationId}`
  );
  return data;
};

export const useGetEventActivation = (
  eventId: string = "",
  activationId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventActivation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventActivation>>(
    EVENT_ACTIVATION_QUERY_KEY(eventId, activationId),
    (params) => GetEventActivation({ eventId, activationId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!activationId && (options?.enabled ?? true),
    }
  );
};
