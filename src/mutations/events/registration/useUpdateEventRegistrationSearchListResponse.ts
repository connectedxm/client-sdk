import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfEventRegistrationSearchListResponseParams
  extends MutationParams {
  eventId: string;
  passId: string;
  questionId: string;
  searchListValueId: string;
}

/**
 * @category Methods
 * @group Self
 */
export const UpdateSelfEventRegistrationSearchListResponse = async ({
  eventId,
  passId,
  questionId,
  searchListValueId,
  clientApiParams,
  queryClient,
}: UpdateSelfEventRegistrationSearchListResponseParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/passes/${passId}/questions/${questionId}`,
    { response: searchListValueId }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Self
 */
export const useUpdateSelfEventRegistrationSearchListResponse = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfEventRegistrationSearchListResponse>>,
      Omit<
        UpdateSelfEventRegistrationSearchListResponseParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfEventRegistrationSearchListResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSelfEventRegistrationSearchListResponse, options);
};
