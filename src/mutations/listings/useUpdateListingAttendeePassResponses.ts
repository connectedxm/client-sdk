import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingAttendeePassSectionQuestions";
import {
  LISTING_ATTENDEE_QUERY_KEY,
  LISTING_ATTENDEES_QUERY_KEY,
  LISTING_PASS_QUERY_KEY,
  LISTING_PASSES_QUERY_KEY,
  LISTING_REPORT_QUERY_KEY,
} from "@src/queries";

export interface UpdateListingRegistrationPurchaseResponsesParams
  extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
  questions: {
    id: number;
    value: string;
  }[];
}

export const UpdateListingRegistrationPurchaseResponses = async ({
  eventId,
  accountId,
  passId,
  questions,
  clientApiParams,
  queryClient,
}: UpdateListingRegistrationPurchaseResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}/responses`,
    {
      questions,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY(
        eventId,
        accountId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_ATTENDEES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_ATTENDEE_QUERY_KEY(eventId, accountId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_PASSES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_REPORT_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useUpdateListingRegistrationPurchaseResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListingRegistrationPurchaseResponses>>,
      Omit<
        UpdateListingRegistrationPurchaseResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingRegistrationPurchaseResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateListingRegistrationPurchaseResponses, options);
};
