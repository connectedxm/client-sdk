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

export const EVENT_ACTIVATION_SUMMARY_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_ACTIVATIONS_QUERY_KEY(eventId), "SUMMARY"];

export interface GetEventActivationSummaryProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventActivationSummary = async ({
  eventId,
  clientApiParams,
}: GetEventActivationSummaryProps): Promise<
  ConnectedXMResponse<{
    total: number;
    completed: number;
    next: EventActivation | null;
  }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/summary`
  );
  return data;
};

export const useGetEventActivationSummary = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventActivationSummary>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventActivationSummary>>(
    EVENT_ACTIVATION_SUMMARY_QUERY_KEY(eventId),
    (params) => GetEventActivationSummary({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
