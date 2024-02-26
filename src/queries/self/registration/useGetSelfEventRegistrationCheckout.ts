import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import { ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export interface CheckoutResponse {
  type: "stripe" | "paypal";
  connectionId: string;
  intentId: string;
  secret: string;
}

export const SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY = (
  eventId: string,
  registrationId: string
) => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  registrationId,
  "CHECKOUT",
];

export interface GetSelfEventRegistrationCheckoutProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetSelfEventRegistrationCheckout = async ({
  eventId,
  registrationId,
  clientApiParams,
}: GetSelfEventRegistrationCheckoutProps): Promise<
  Awaited<ConnectedXMResponse<CheckoutResponse>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/draft/checkout`
  );
  return data;
};

export const useGetSelfEventRegistrationCheckout = (
  eventId: string,
  registrationId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationCheckout>
  > = {}
) => {
  const { authenticated } = useConnectedXM();
  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationCheckout>
  >(
    SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(eventId, registrationId),
    (params) =>
      GetSelfEventRegistrationCheckout({ eventId, registrationId, ...params }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        (options.enabled ?? true),
    }
  );
};
