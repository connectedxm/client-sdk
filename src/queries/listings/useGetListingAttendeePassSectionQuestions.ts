import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
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
