import { ConnectedXMResponse, EventSessionAccess } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { SELF_QUERY_KEY } from "../../useGetSelf";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [
  ...SELF_QUERY_KEY(),
  "SESSION_REGISTRATION",
  eventId,
  sessionId,
];

export const SET_SELF_EVENT_SESSION_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventSessionRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventSessionRegistrationProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetSelfEventSessionRegistration = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetSelfEventSessionRegistrationProps): Promise<
  ConnectedXMResponse<EventSessionAccess[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration`
  );

  return data;
};

export const useGetSelfEventSessionRegistration = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventSessionRegistration>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventSessionRegistration>
  >(
    SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetSelfEventSessionRegistration({
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
