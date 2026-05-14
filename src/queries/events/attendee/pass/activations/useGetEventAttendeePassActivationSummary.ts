import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../../useConnectedSingleQuery";

import { EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY } from "./useGetEventAttendeePassActivations";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ATTENDEE_PASS_ACTIVATION_SUMMARY_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...EVENT_ATTENDEE_PASS_ACTIVATIONS_QUERY_KEY(eventId, passId),
  "SUMMARY",
];

export interface GetEventAttendeePassActivationSummaryProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventAttendeePassActivationSummary = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventAttendeePassActivationSummaryProps): Promise<
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

export const useGetEventAttendeePassActivationSummary = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassActivationSummary>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassActivationSummary>
  >(
    EVENT_ATTENDEE_PASS_ACTIVATION_SUMMARY_QUERY_KEY(eventId, passId),
    (params) =>
      GetEventAttendeePassActivationSummary({ eventId, passId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
