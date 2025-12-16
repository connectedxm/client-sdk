import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_ATTENDEE_QUERY_KEY } from "@src/queries";

export const EVENT_LISTING_PASS_QUESTIONS_QUERY_KEY = (
  eventId: string,
  accountId: string,
  passId: string
): QueryKey => [
  ...EVENT_LISTING_ATTENDEE_QUERY_KEY(eventId, accountId),
  passId,
  "SECTIONS",
];

export const SET_EVENT_LISTING_PASS_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_LISTING_PASS_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventListingPassQuestions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_LISTING_PASS_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventListingPassQuestionsProps extends SingleQueryParams {
  eventId: string;
  accountId: string;
  passId: string;
}

export const GetEventListingPassQuestions = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
}: GetEventListingPassQuestionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}/questions`,
    {}
  );

  return data;
};

export const useGetEventListingPassQuestions = (
  eventId: string,
  accountId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventListingPassQuestions>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetEventListingPassQuestions>
  >(
    EVENT_LISTING_PASS_QUESTIONS_QUERY_KEY(eventId, accountId, passId),
    (params: SingleQueryParams) =>
      GetEventListingPassQuestions({
        eventId,
        accountId,
        passId,
        ...params,
      }),
    {
      retry: false,
      ...options,
      enabled:
        !!eventId && !!accountId && !!passId && (options?.enabled ?? true),
    }
  );
};
