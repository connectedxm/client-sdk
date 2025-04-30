import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY } from "./useGetSelfEventSessionRegistration";

export const SELF_EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [
  ...SELF_EVENT_SESSION_REGISTRATION_QUERY_KEY(eventId, sessionId),
  "PASSES",
];

export const SET_SELF_EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventSessionRegistrationAvailablePasses>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY(
        ...keyParams
      ),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventSessionRegistrationAvailablePassesProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetSelfEventSessionRegistrationAvailablePasses = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetSelfEventSessionRegistrationAvailablePassesProps): Promise<
  ConnectedXMResponse<Pass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/sessions/${sessionId}/registration/passes`,
    {}
  );

  return data;
};

export const useGetSelfEventSessionRegistrationAvailablePasses = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventSessionRegistrationAvailablePasses>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventSessionRegistrationAvailablePasses>
  >(
    SELF_EVENT_SESSION_REGISTRATION_AVAILABLE_PASSES_QUERY_KEY(
      eventId,
      sessionId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventSessionRegistrationAvailablePasses({
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
