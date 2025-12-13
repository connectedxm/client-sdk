import {
  ConnectedXMResponse,
  Pass,
  RegistrationQuestion,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

interface ResponseWithQuestion extends RegistrationQuestionResponse {
  question: RegistrationQuestion;
}

interface PassWithResponseQuestions extends Pass {
  responses: ResponseWithQuestion[];
}

export const EVENT_PASS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "PASS", passId];

export const SET_EVENT_PASS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPass>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PASS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventPassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPass = async ({
  eventId,
  passId,
  clientApiParams,
}: GetEventPassProps): Promise<
  ConnectedXMResponse<PassWithResponseQuestions>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/passes/${passId}`
  );

  return data;
};

export const useGetEventPass = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<ReturnType<typeof GetEventPass>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventPass>>(
    EVENT_PASS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPass({
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
