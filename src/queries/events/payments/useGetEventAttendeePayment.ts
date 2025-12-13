import { ConnectedXMResponse, Payment } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const EVENT_ATTENDEE_PAYMENT_QUERY_KEY = (
  eventId: string,
  paymentId: string
): QueryKey => [
  ...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId),
  "PAYMENT",
  paymentId,
];

export const SET_EVENT_ATTENDEE_PAYMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeePayment>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_PAYMENT_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeePaymentProps extends SingleQueryParams {
  eventId: string;
  paymentId: string;
}

export const GetEventAttendeePayment = async ({
  eventId,
  paymentId,
  clientApiParams,
}: GetEventAttendeePaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/payments/${paymentId}`,
    {}
  );

  return data;
};

export const useGetEventAttendeePayment = (
  eventId: string,
  paymentId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeePayment>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetEventAttendeePayment>
  >(
    EVENT_ATTENDEE_PAYMENT_QUERY_KEY(eventId, paymentId),
    (params: SingleQueryParams) =>
      GetEventAttendeePayment({
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
