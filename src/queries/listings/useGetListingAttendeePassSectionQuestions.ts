import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ATTENDEE_QUERY_KEY } from "./useGetListingAttendee";

export const LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY = (
  eventId: string,
  accountId: string,
  passId: string
): QueryKey => [
  ...LISTING_ATTENDEE_QUERY_KEY(eventId, accountId),
  passId,
  "SECTIONS",
];

export const SET_LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY
  >,
  response: Awaited<ReturnType<typeof GetListingAttendeePassQuestionSections>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetListingAttendeePassQuestionSectionsProps
  extends SingleQueryParams {
  eventId: string;
  accountId: string;
  passId: string;
}

export const GetListingAttendeePassQuestionSections = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
}: GetListingAttendeePassQuestionSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}`,
    {}
  );

  return data;
};

export const useGetListingAttendeePassQuestionSections = (
  eventId: string,
  accountId: string,
  passId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetListingAttendeePassQuestionSections>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetListingAttendeePassQuestionSections>
  >(
    LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(
      eventId,
      accountId,
      passId
    ),
    (params: SingleQueryParams) =>
      GetListingAttendeePassQuestionSections({
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
