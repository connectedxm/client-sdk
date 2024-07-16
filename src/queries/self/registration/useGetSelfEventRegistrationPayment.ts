import { ConnectedXMResponse, Payment } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

export const SELF_EVENT_REGISTRATION_PAYMENT_QUERY_KEY = (
  eventId: string,
  paymentId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "PAYMENT",
  paymentId,
];

export const SET_SELF_EVENT_REGISTRATION_PAYMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationPayment>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_PAYMENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventRegistrationPaymentProps
  extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  paymentId: string;
}

export const GetSelfEventRegistrationPayment = async ({
  eventId,
  registrationId,
  paymentId,
  clientApiParams,
}: GetSelfEventRegistrationPaymentProps): Promise<
  ConnectedXMResponse<Payment>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/registered/payments/${paymentId}`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationPayment = (
  eventId: string,
  registrationId: string,
  paymentId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationPayment>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationPayment>
  >(
    SELF_EVENT_REGISTRATION_PAYMENT_QUERY_KEY(eventId, paymentId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationPayment({
        eventId,
        registrationId,
        paymentId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        !!paymentId &&
        (options?.enabled ?? true),
    }
  );
};
