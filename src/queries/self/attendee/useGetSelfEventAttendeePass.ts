import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PASS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "PASS", passId];

export const SET_SELF_EVENT_ATTENDEE_PASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_ATTENDEE_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventAttendeePass>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeePassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventAttendeePass = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeePassProps): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}`
  );

  return data;
};

export const useGetSelfEventAttendeePass = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventAttendeePass>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventAttendeePass>>(
    SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePass({
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
