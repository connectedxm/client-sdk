import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

export const EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "AVAILABLE_ADD_ONS",
];

export const SET_EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePassAddOns>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassAddOnsProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventAttendeePassAddOns = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventAttendeePassAddOnsProps): Promise<
  ConnectedXMResponse<EventAddOn[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/addOns`,
    {}
  );

  return data;
};

export const useGetEventAttendeePassAddOns = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassAddOns>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassAddOns>
  >(
    EVENT_ATTENDEE_PASS_ADD_ONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventAttendeePassAddOns({
        eventId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
