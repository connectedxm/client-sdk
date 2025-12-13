import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_REGISTRATION_QUERY_KEY } from "./useGetEventRegistration";

export const EVENT_REGISTRATION_QUESTIONS_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_REGISTRATION_QUERY_KEY(eventId), "QUESTIONS"];

export const SET_EVENT_REGISTRATION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationQuestions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventRegistrationQuestionsProps extends SingleQueryParams {
  eventId: string;
}

export const GetEventRegistrationQuestions = async ({
  eventId,
  clientApiParams,
}: GetEventRegistrationQuestionsProps): Promise<
  ConnectedXMResponse<
    {
      passId: string;
      sections: RegistrationSection[];
    }[]
  >
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/questions`,
    {}
  );

  return data;
};

export const useGetEventRegistrationQuestions = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventRegistrationQuestions>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventRegistrationQuestions>
  >(
    EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventRegistrationQuestions({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
