import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, RegistrationDraft } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY,
  SELF_EVENT_REGISTRATION_QUERY_KEY,
} from "@src/queries";

export interface SaveSelfEventRegistrationDraftV2Params extends MutationParams {
  eventId: string;
  draft: RegistrationDraft;
}

export const SaveSelfEventRegistrationDraftV2 = async ({
  eventId,
  draft,
  clientApiParams,
  queryClient,
}: SaveSelfEventRegistrationDraftV2Params): Promise<
  ConnectedXMResponse<RegistrationDraft>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<RegistrationDraft>>(
    `/self/events/${eventId}/registration/v2/draft`,
    draft
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_INTENT_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

export const useSaveSelfEventRegistrationDraftV2 = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof SaveSelfEventRegistrationDraftV2>>,
      Omit<
        SaveSelfEventRegistrationDraftV2Params,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    SaveSelfEventRegistrationDraftV2Params,
    Awaited<ReturnType<typeof SaveSelfEventRegistrationDraftV2>>
  >(SaveSelfEventRegistrationDraftV2, options);
};
