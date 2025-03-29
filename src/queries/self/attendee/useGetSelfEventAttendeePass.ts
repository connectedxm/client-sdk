import {
  ConnectedXMResponse,
  Pass,
  RegistrationQuestion,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

interface ResponseWithQuestion extends RegistrationQuestionResponse {
  question: RegistrationQuestion;
}

interface PassWithResponseQuestions extends Pass {
  responses: ResponseWithQuestion[];
}

export const SELF_EVENT_ATTENDEE_PASS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "PASS", passId];

export interface GetSelfEventAttendeePassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventAttendeePass = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventAttendeePassProps): Promise<
  ConnectedXMResponse<PassWithResponseQuestions>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}`
  );

  return data;
};

export const useGetSelfEventAttendeePass = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfEventAttendeePass>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventAttendeePass>>(
    SELF_EVENT_ATTENDEE_PASS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePass({
        eventId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
