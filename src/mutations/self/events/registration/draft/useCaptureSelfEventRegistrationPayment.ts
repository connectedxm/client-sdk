import { ConnectedXMResponse, Registration } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";
import { SET_SELF_EVENT_REGISTRATION_QUERY_DATA } from "@src/queries";

export interface CaptureSelfEventRegistrationPaymentParams
  extends MutationParams {
  eventId: string;
  registrationId: string;
}

export const CaptureSelfEventRegistrationPayment = async ({
  eventId,
  registrationId,
  clientApi,
  queryClient,
  locale = "en",
}: CaptureSelfEventRegistrationPaymentParams): Promise<
  ConnectedXMResponse<Registration>
> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Registration>>(
    `/self/events/${eventId}/registration/${registrationId}/draft/capture`
  );

  if (queryClient && data.status === "ok") {
    SET_SELF_EVENT_REGISTRATION_QUERY_DATA(queryClient, [eventId], data, [
      locale,
    ]);
  }

  return data;
};

export const useCaptureSelfEventRegistrationPayment = (
  params: Omit<MutationParams, "clientApi" | "queryClient"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CaptureSelfEventRegistrationPayment>>,
      Omit<
        CaptureSelfEventRegistrationPaymentParams,
        "queryClient" | "clientApi"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CaptureSelfEventRegistrationPaymentParams,
    Awaited<ReturnType<typeof CaptureSelfEventRegistrationPayment>>
  >(CaptureSelfEventRegistrationPayment, params, options);
};
