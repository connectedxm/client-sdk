import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_ATTENDEE_PASS_QUESTION_SECTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingAttendeePassSectionQuestions";
import {
  LISTING_ATTENDEE_QUERY_KEY,
  LISTING_ATTENDEES_QUERY_KEY,
  LISTING_PASS_QUERY_KEY,
  LISTING_PASSES_QUERY_KEY,
  LISTING_REPORT_QUERY_KEY,
} from "@src/queries";
import { EventAttendeePassResponsesUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventAttendeePassResponsesParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
  responses: EventAttendeePassResponsesUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventAttendeePassResponses = async ({
  eventId,
  accountId,
  passId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateEventAttendeePassResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}/responses`,
    responses
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

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventAttendeePassResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventAttendeePassResponses>>,
      Omit<
        UpdateEventAttendeePassResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventAttendeePassResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventAttendeePassResponses, options);
};
