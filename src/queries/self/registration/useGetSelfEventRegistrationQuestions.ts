import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId), "QUESTIONS"];

export const SET_SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationQuestions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationQuestionsProps
  extends SingleQueryParams {
  eventId: string;
}

export const GetSelfEventRegistrationQuestions = async ({
  eventId,
  clientApiParams,
}: GetSelfEventRegistrationQuestionsProps): Promise<
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

export const useGetSelfEventRegistrationQuestions = (
  eventId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationQuestions>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationQuestions>
  >(
    SELF_EVENT_REGISTRATION_QUESTIONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationQuestions({
        eventId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
