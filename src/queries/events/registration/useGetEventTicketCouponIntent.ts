import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { EVENT_REGISTRATION_QUERY_KEY } from "@src/queries";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const EVENT_TICKET_COUPON_INTENT_QUERY_KEY = (
  eventId: string,
  ticketId: string,
  quantity: number,
  addressId: string
) => [
  ...EVENT_REGISTRATION_QUERY_KEY(eventId),
  "COUPON_INTENT",
  ticketId,
  quantity,
  addressId,
];

export interface GetEventTicketCouponIntentProps extends SingleQueryParams {
  eventId: string;
  ticketId: string;
  quantity: number;
  addressId: string;
}

export const GetEventTicketCouponIntent = async ({
  eventId,
  ticketId,
  quantity,
  addressId,
  clientApiParams,
}: GetEventTicketCouponIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/coupons/intent`,
    {
      params: {
        ticketId,
        quantity,
        addressId,
      },
    }
  );
  return data;
};

export const useGetEventTicketCouponIntent = (
  eventId: string = "",
  ticketId: string = "",
  quantity: number = 0,
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventTicketCouponIntent>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketCouponIntent>>(
    EVENT_TICKET_COUPON_INTENT_QUERY_KEY(
      eventId,
      ticketId,
      quantity,
      addressId
    ),
    (params) =>
      GetEventTicketCouponIntent({
        eventId,
        ticketId,
        quantity,
        addressId,
        ...params,
      }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!ticketId &&
        !!quantity &&
        !!addressId &&
        (options?.enabled ?? true),
    }
  );
};
