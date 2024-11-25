import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, SessionPass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY,
} from "@src/queries/self/registration/sessions";

export interface AddSelfEventRegistrationPurchaseSessionParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  sessionId: string;
}

export const AddSelfEventRegistrationPurchaseSession = async ({
  eventId,
  registrationId,
  purchaseId,
  sessionId,
  clientApiParams,
  queryClient,
}: AddSelfEventRegistrationPurchaseSessionParams): Promise<
  ConnectedXMResponse<SessionPass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<SessionPass>>(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/sessions`,
    {
      sessionId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
    });
  }
  return data;
};

export const useAddSelfEventRegistrationPurchaseSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddSelfEventRegistrationPurchaseSession>>,
      Omit<
        AddSelfEventRegistrationPurchaseSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddSelfEventRegistrationPurchaseSessionParams,
    Awaited<ReturnType<typeof AddSelfEventRegistrationPurchaseSession>>
  >(AddSelfEventRegistrationPurchaseSession, options);
};
