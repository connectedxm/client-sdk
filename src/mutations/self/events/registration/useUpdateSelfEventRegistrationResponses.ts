import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries";

export interface UpdateSelfEventRegistrationResponsesParams
  extends MutationParams {
  eventId: string;
  passes: {
    id: string;
    responses: { questionId: number; value: string }[];
  }[];
}

export const UpdateSelfEventRegistrationResponses = async ({
  eventId,
  passes,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationResponsesParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/questions`,
    passes
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useUpdateSelfEventRegistrationResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationResponses>>,
      Omit<
        UpdateSelfEventRegistrationResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationResponsesParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventRegistrationResponses, options);
};
