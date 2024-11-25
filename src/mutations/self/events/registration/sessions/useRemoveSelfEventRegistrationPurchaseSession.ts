import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY,
  SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY,
} from "@src/queries/self/registration/sessions";

export interface RemoveSelfEventRegistrationPurchaseSessionParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  sessionPassId: string;
}

export const RemoveSelfEventRegistrationPurchaseSession = async ({
  eventId,
  registrationId,
  purchaseId,
  sessionPassId,
  clientApiParams,
  queryClient,
}: RemoveSelfEventRegistrationPurchaseSessionParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/sessions/${sessionPassId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_SESSIONS_INTENT_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: SELF_EVENT_REGISTRATION_PURCHASE_SESSIONS_QUERY_KEY(
        eventId,
        registrationId,
        purchaseId
      ),
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

export const useRemoveSelfEventRegistrationPurchaseSession = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveSelfEventRegistrationPurchaseSession>>,
      Omit<
        RemoveSelfEventRegistrationPurchaseSessionParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveSelfEventRegistrationPurchaseSessionParams,
    Awaited<ReturnType<typeof RemoveSelfEventRegistrationPurchaseSession>>
  >(RemoveSelfEventRegistrationPurchaseSession, options);
};
