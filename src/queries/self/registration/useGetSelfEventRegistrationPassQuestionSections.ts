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

export const SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  passId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "PASSES",
  passId,
  "QUESTIONS",
];

export const SET_SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetSelfEventRegistrationPassQuestionSections>
  >,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPassQuestionSectionsProps
  extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetSelfEventRegistrationPassQuestionSections = async ({
  eventId,
  passId,
  clientApiParams,
}: GetSelfEventRegistrationPassQuestionSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/passes/${passId}/questions`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPassQuestionSections = (
  eventId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPassQuestionSections>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPassQuestionSections>
  >(
    SELF_EVENT_REGISTRATION_PASS_QUESTION_SECTIONS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPassQuestionSections({
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
