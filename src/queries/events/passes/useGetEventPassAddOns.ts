import { ConnectedXMResponse, EventAddOn } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const EVENT_PASS_ADD_ONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "AVAILABLE_ADD_ONS",
];

export const SET_EVENT_PASS_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassAddOns>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_ADD_ONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassAddOnsProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPassAddOns = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventPassAddOnsProps): Promise<
  ConnectedXMResponse<EventAddOn[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/addOns`,
    {}
  );

  return data;
};

export const useGetEventPassAddOns = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPassAddOns>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventPassAddOns>
  >(
    EVENT_PASS_ADD_ONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPassAddOns({
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
