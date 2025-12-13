import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";

import { EVENT_ACTIVATIONS_QUERY_KEY } from "./useGetEventActivations";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ACTIVATION_SUMMARY_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...EVENT_ACTIVATIONS_QUERY_KEY(eventId, passId), "SUMMARY"];

export interface GetEventActivationSummaryProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventActivationSummary = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventActivationSummaryProps): Promise<
  ConnectedXMResponse<{
    total: number;
    completed: number;
  }>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/${passId}/summary`
  );
  return data;
};

export const useGetEventActivationSummary = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventActivationSummary>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventActivationSummary>>(
    EVENT_ACTIVATION_SUMMARY_QUERY_KEY(eventId, passId),
    (params) => GetEventActivationSummary({ eventId, passId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
