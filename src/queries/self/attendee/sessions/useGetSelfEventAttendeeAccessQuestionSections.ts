import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY } from "./useGetSelfEventAttendeeAccess";

export const SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  passId: string,
  sessionId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_ACCESS_QUERY_KEY(eventId, passId, sessionId),
  "SECTIONS",
];

export const SET_SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventAttendeeAccessQuestionSections>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeeAccessQuestionSectionsProps
  extends SingleQueryParams {
  eventId: string;
  sessionId: string;
  passId: string;
}

export const GetSelfEventAttendeeAccessQuestionSections = async ({
  eventId,
  sessionId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeeAccessQuestionSectionsProps): Promise<
  ConnectedXMResponse<EventSessionSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/questions`
  );

  return data;
};

export const useGetSelfEventAttendeeAccessQuestionSections = (
  eventId: string,
  passId: string,
  sessionId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeeAccessQuestionSections>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeeAccessQuestionSections>
  >(
    SELF_EVENT_ATTENDEE_ACCESS_QUESTION_SECTIONS_QUERY_KEY(
      eventId,
      passId,
      sessionId
    ),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeeAccessQuestionSections({
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
