import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import {
  SELF_EVENT_REGISTRATION_STATUS_QUERY_KEY,
  SET_SELF_EVENT_REGISTRATION_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

export interface CaptureSelfEventRegistrationPaymentParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const CaptureSelfEventRegistrationPayment = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
}: CaptureSelfEventRegistrationPaymentParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/capture`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_REGISTRATION_STATUS_QUERY_KEY(eventId),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "events",
      eventId
    );
  }

  return data;
};

export const useCaptureSelfEventRegistrationPayment = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CaptureSelfEventRegistrationPayment>>,
      Omit<
        CaptureSelfEventRegistrationPaymentParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CaptureSelfEventRegistrationPaymentParams,
    Awaited<ReturnType<typeof CaptureSelfEventRegistrationPayment>>
  >(CaptureSelfEventRegistrationPayment, options);
};
