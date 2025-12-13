import { ConnectedXMResponse, RegistrationFollowup } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "FOLLOWUPS",
];

export const SET_SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventAttendeePassQuestionFollowups>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeePassQuestionFollowupsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventAttendeePassQuestionFollowups = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeePassQuestionFollowupsProps): Promise<
  ConnectedXMResponse<RegistrationFollowup[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}/followups`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeePassQuestionFollowups = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePassQuestionFollowups>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePassQuestionFollowups>
  >(
    SELF_EVENT_ATTENDEE_PASS_QUESTION_FOLLOWUPS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePassQuestionFollowups({
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
