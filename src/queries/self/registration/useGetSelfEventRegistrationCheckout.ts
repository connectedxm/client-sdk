import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import useConnectedSingleQuery, {
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

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

interface GetSelfEventRegistrationCheckoutProps extends SingleQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetSelfEventRegistrationCheckout = async ({
  eventId,
  registrationId,
  locale,
}: GetSelfEventRegistrationCheckoutProps): Promise<
  ConnectedXMResponse<CheckoutResponse>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/draft/checkout`
  );
  return data;
};

const useGetSelfEventRegistrationCheckout = (
  eventId: string,
  registrationId: string = ""
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCheckout>>
  >(
    SELF_EVENT_REGISTRATION_CHECKOUT_QUERY_KEY(eventId, registrationId),
    () => GetSelfEventRegistrationCheckout({ eventId, registrationId }),
    {
      enabled: !!token && !!eventId && !!registrationId,
      staleTime: Infinity,
      cacheTime: Infinity,
      retry: false,
      retryOnMount: false,
    }
  );
};

export default useGetSelfEventRegistrationCheckout;
