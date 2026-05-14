import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY } from "./useGetEventAttendeePassAccess";

export const EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string
): QueryKey => [
  ...EVENT_ATTENDEE_PASS_ACCESS_QUERY_KEY(eventId, passId, sessionId),
  "SECTIONS",
];

export const SET_EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventAttendeePassAccessQuestionSections>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassAccessQuestionSectionsProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

export const GetEventAttendeePassAccessQuestionSections = async ({
  eventId,
  sessionId,
  passId,
  clientApiParams,
}: GetEventAttendeePassAccessQuestionSectionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/questions`
  );

  return data;
};

export const useGetEventAttendeePassAccessQuestionSections = (
  eventId: string,
  passId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassAccessQuestionSections>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassAccessQuestionSections>
  >(
    EVENT_ATTENDEE_PASS_ACCESS_QUESTION_SECTIONS_QUERY_KEY(
      eventId,
      passId,
      sessionId
    ),
    (params: SingleQueryParams) =>
      GetEventAttendeePassAccessQuestionSections({
        eventId,
        passId,
        sessionId,
        ...params,
      }),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!passId &&
        !!sessionId &&
        (options?.enabled ?? true),
    }
  );
};
