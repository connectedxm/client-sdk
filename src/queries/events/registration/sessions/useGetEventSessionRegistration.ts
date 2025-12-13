import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "@src/queries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_SESSION_REGISTRATION_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [
  ...SELF_QUERY_KEY(),
  "SESSION_REGISTRATION",
  eventId,
  sessionId,
];

export const SET_EVENT_SESSION_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventSessionRegistrationProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionRegistration = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetEventSessionRegistrationProps): Promise<
  ConnectedXMResponse<EventSessionAccess[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration`
  );

  return data;
};

export const useGetEventSessionRegistration = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionRegistration>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionRegistration>
  >(
    EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetEventSessionRegistration({
        eventId,
        sessionId,
        ...params,
      }),
    {
      ...options,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
