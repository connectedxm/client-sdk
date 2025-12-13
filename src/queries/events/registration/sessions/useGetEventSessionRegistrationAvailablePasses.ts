import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_SESSION_REGISTRATION_QUERY_KEY } from "./useGetEventSessionRegistration";

export const EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [
  ...EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
  "PASSES",
];

export const SET_EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventSessionRegistrationAvailablePasses>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventSessionRegistrationAvailablePassesProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetEventSessionRegistrationAvailablePasses = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetEventSessionRegistrationAvailablePassesProps): Promise<
  ConnectedXMResponse<Pass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes`,
    {}
  );

  return data;
};

export const useGetEventSessionRegistrationAvailablePasses = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionRegistrationAvailablePasses>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionRegistrationAvailablePasses>
  >(
    EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetEventSessionRegistrationAvailablePasses({
        eventId,
        sessionId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
