import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

export const EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "QUESTIONS",
];

export const SET_EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetEventAttendeePassQuestionSections>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePassQuestionSectionsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventAttendeePassQuestionSections = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventAttendeePassQuestionSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/questions`,
    {}
  );

  return data;
};

export const useGetEventAttendeePassQuestionSections = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePassQuestionSections>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePassQuestionSections>
  >(
    EVENT_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventAttendeePassQuestionSections({
        eventId,
        passId,
        ...params,
      }),
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
