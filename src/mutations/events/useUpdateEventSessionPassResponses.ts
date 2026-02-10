import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_SESSION_PASS_INTENT_QUERY_KEY } from "@src/queries/events/useGetEventSessionPassIntent";

export interface UpdateEventSessionPassResponsesParams extends MutationParams {
  eventId: string;
  sessionId: string;
  passId: string;
  responses: { questionId: string; value: string }[];
}

export const UpdateEventSessionPassResponses = async ({
  eventId,
  sessionId,
  passId,
  responses,
  clientApiParams,
  queryClient,
}: UpdateEventSessionPassResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/events/${eventId}/sessions/${sessionId}/passes/${passId}/responses`,
    { responses }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: EVENT_SESSION_PASS_INTENT_QUERY_KEY(eventId, sessionId, passId),
      exact: false,
    });
  }

  return data;
};

export const useUpdateEventSessionPassResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventSessionPassResponses>>,
      Omit<
        UpdateEventSessionPassResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSessionPassResponsesParams,
    Awaited<ReturnType<typeof UpdateEventSessionPassResponses>>
  >(UpdateEventSessionPassResponses, options);
};
