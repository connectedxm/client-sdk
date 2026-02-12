import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_SESSION_QUERY_KEY } from "@src/index";

export const EVENT_SESSION_PASS_SECTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  passId: string
): QueryKey => [
  ...EVENT_SESSION_QUERY_KEY(eventId, sessionId),
  "PASSES",
  passId,
  "QUESTIONS",
];

export const SET_EVENT_SESSION_PASS_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SESSION_PASS_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionPassSections>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SESSION_PASS_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventSessionPassSectionsProps extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

export const GetEventSessionPassSections = async ({
  eventId,
  sessionId,
  passId,
  clientApiParams,
}: GetEventSessionPassSectionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/questions`,
    {}
  );

  return data;
};

export const useGetEventSessionPassSections = (
  eventId: string,
  sessionId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventSessionPassSections>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventSessionPassSections>
  >(
    EVENT_SESSION_PASS_SECTIONS_QUERY_KEY(eventId, sessionId, passId),
    (params: SingleQueryParams) =>
      GetEventSessionPassSections({
        eventId,
        sessionId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!sessionId &&
        !!passId &&
        (options?.enabled ?? true),
    }
  );
};
