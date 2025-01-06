import { ConnectedXMResponse, Payment } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PAYMENT_QUERY_KEY = (
  eventId: string,
  paymentId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PAYMENT",
  paymentId,
];

export const SET_SELF_EVENT_ATTENDEE_PAYMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_ATTENDEE_PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventAttendeePayment>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_ATTENDEE_PAYMENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeePaymentProps extends SingleQueryParams {
  eventId: string;
  paymentId: string;
}

export const GetSelfEventAttendeePayment = async ({
  eventId,
  paymentId,
  clientApiParams,
}: GetSelfEventAttendeePaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/payments/${paymentId}`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeePayment = (
  eventId: string,
  paymentId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeePayment>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventAttendeePayment>
  >(
    SELF_EVENT_ATTENDEE_PAYMENT_QUERY_KEY(eventId, paymentId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeePayment({
        eventId,
        paymentId,
        ...params,
      }),
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!paymentId &&
        (options?.enabled ?? true),
    }
  );
};
