import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries";

export interface UpdateSelfEventRegistrationPassResponseParams
  extends MutationParams {
  eventId: string;
  passId: string;
  questionId: string;
  response: string;
}

export const UpdateSelfEventRegistrationPassResponse = async ({
  eventId,
  passId,
  questionId,
  response,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationPassResponseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/passes/${passId}/questions/${questionId}`,
    { response }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

export const useUpdateSelfEventRegistrationPassResponse = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationPassResponse>>,
      Omit<
        UpdateSelfEventRegistrationPassResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationPassResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventRegistrationPassResponse, options);
};
