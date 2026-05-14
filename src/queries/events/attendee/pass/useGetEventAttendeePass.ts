import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

export const EVENT_ATTENDEE_PASS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...EVENT_ATTENDEE_QUERY_KEY(eventId), "PASS", passId];

export const SET_EVENT_ATTENDEE_PASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePass>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventAttendeePass = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventAttendeePassProps): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}`
  );

  return data;
};

export const useGetEventAttendeePass = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventAttendeePass>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventAttendeePass>>(
    EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventAttendeePass({
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
