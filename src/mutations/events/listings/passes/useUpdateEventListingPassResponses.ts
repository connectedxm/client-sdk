import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_LISTING_ATTENDEES_QUERY_KEY,
  EVENT_LISTING_PASS_QUERY_KEY,
  EVENT_LISTING_PASS_QUESTIONS_QUERY_KEY,
  EVENT_LISTING_PASSES_QUERY_KEY,
  EVENT_LISTING_REPORT_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventListingPassResponsesParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
  responses: {
    questionId: string;
    value: string;
  }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventListingPassResponses = async ({
  eventId,
  accountId,
  passId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateEventListingPassResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}/responses`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_PASS_QUESTIONS_QUERY_KEY(
        eventId,
        accountId,
        passId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_ATTENDEES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_PASSES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_PASS_QUERY_KEY(eventId, passId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_REPORT_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventListingPassResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventListingPassResponses>>,
      Omit<
        UpdateEventListingPassResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventListingPassResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventListingPassResponses, options);
};
