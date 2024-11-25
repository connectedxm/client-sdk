import { ConnectedXMResponse, SessionPass } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "../useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_SESSION_PASSES_QUERY_KEY = (
  eventId: string,
  sessionId: string
): QueryKey => [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), sessionId];

export const SET_SELF_EVENT_REGISTRATION_SESSION_PASSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_SESSION_PASSES_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationSessionPasses>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_SESSION_PASSES_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationSessionPassesProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
}

export const GetSelfEventRegistrationSessionPasses = async ({
  eventId,
  sessionId,
  clientApiParams,
}: GetSelfEventRegistrationSessionPassesProps): Promise<
  ConnectedXMResponse<SessionPass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/sessions/${sessionId}/passes`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationSessionPasses = (
  eventId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationSessionPasses>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationSessionPasses>
  >(
    SELF_EVENT_REGISTRATION_SESSION_PASSES_QUERY_KEY(eventId, sessionId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationSessionPasses({
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
