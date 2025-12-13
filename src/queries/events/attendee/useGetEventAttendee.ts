import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../../self/useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_ATTENDEE_QUERY_KEY = (eventId: string): QueryKey => [
  ...SELF_QUERY_KEY(),
  "EVENTS",
  "ATTENDEE",
  eventId,
];

export const SET_EVENT_ATTENDEE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendee>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeeProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventAttendee = async ({
  eventId,
  clientApiParams,
}: GetEventAttendeeProps): Promise<
  ConnectedXMResponse<Registration | null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/attendee`);

  return data;
};

export const useGetEventAttendee = (
  eventId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventAttendee>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventAttendee>>(
    EVENT_ATTENDEE_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventAttendee({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
