import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import {
  EVENT_PASS_ACCESS_QUERY_KEY,
  EVENT_PASS_ACCESS_QUESTIONS_QUERY_KEY,
} from "@src/queries/events/passes/access";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventSessionAccessResponsesParams
  extends MutationParams {
  eventId: string;
  passId: string;
  sessionId: string;
  responses: {
    questionId: string;
    value: string;
  }[];
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventSessionAccessResponses = async ({
  eventId,
  passId,
  sessionId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateEventSessionAccessResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/attendee/passes/${passId}/sessions/${sessionId}/questions`,
    responses
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ACCESS_QUESTIONS_QUERY_KEY(
        eventId,
        passId,
        sessionId
      ),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_PASS_ACCESS_QUERY_KEY(eventId, passId, sessionId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventSessionAccessResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionAccessResponses>>,
      Omit<
        UpdateEventSessionAccessResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionAccessResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateEventSessionAccessResponses, options);
};
