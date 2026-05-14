import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_SESSIONS_QUERY_KEY } from "../../../sessions/useGetEventSessions";

export const EVENT_ATTENDEE_PASS_SESSION_PASS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  sessionId: string,
  passId: string
): QueryKey => [
  ...EVENT_SESSIONS_QUERY_KEY(eventId),
  sessionId,
  "PASSES",
  passId,
  "QUESTIONS",
];

export const SET_EVENT_ATTENDEE_PASS_SESSION_PASS_QUESTION_SECTIONS_QUERY_DATA =
  (
    client: QueryClient,
    keyParams: Parameters<
      typeof EVENT_ATTENDEE_PASS_SESSION_PASS_QUESTION_SECTIONS_QUERY_KEY
    >,
    response: Awaited<
      ReturnType<typeof GetEventAttendeePassSessionPassQuestionSections>
    >,
    baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
  ) => {
    client.setQueryData(
      [
        ...EVENT_ATTENDEE_PASS_SESSION_PASS_QUESTION_SECTIONS_QUERY_KEY(
          ...keyParams
        ),
        ...GetBaseSingleQueryKeys(...baseKeys),
      ],
      response
    );
  };

export interface GetEventAttendeePassSessionPassQuestionSectionsProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

export const GetEventAttendeePassSessionPassQuestionSections = async ({
  eventId,
  sessionId,
  passId,
  clientApiParams,
}: GetEventAttendeePassSessionPassQuestionSectionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/questions`,
    {}
  );

  return data;
};

export const useGetEventAttendeePassSessionPassQuestionSections = (
  eventId: string,
  sessionId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassSessionPassQuestionSections>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassSessionPassQuestionSections>
  >(
    EVENT_ATTENDEE_PASS_SESSION_PASS_QUESTION_SECTIONS_QUERY_KEY(
      eventId,
      sessionId,
      passId
    ),
    (params: SingleQueryParams) =>
      GetEventAttendeePassSessionPassQuestionSections({
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
