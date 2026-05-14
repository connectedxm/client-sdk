import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";

import type { EventActivation } from "@interfaces";
import { EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY } from "./useGetEventAttendeePassActivations";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_KEY = (
  eventId: string,
  passId: string,
  activationId: string
): QueryKey => [
  ...EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY(eventId, passId),
  activationId,
];

export const SET_EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePassActivation>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassActivationProps extends SingleQueryParams {
  eventId: string;
  passId: string;
  activationId: string;
}

export const GetEventAttendeePassActivation = async ({
  eventId,
  passId,
  activationId,
  clientApiParams,
}: GetEventAttendeePassActivationProps): Promise<
  ConnectedXMResponse<EventActivation>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/${passId}/${activationId}`
  );
  return data;
};

export const useGetEventAttendeePassActivation = (
  eventId: string = "",
  passId: string = "",
  activationId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassActivation>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassActivation>
  >(
    EVENT_ATTENDEE_PASS_ACTIVATION_QUERY_KEY(eventId, passId, activationId),
    (params) =>
      GetEventAttendeePassActivation({
        eventId,
        passId,
        activationId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!eventId && !!passId && !!activationId && (options?.enabled ?? true),
    }
  );
};
