import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_TICKET_COUPON_INTENT_QUERY_KEY = (
  eventId: string,
  ticketId: string,
  quantity: number,
  addressId: string
) => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "COUPON_INTENT",
  ticketId,
  quantity,
  addressId,
];

export interface GetSelfEventTicketCouponIntentProps extends SingleQueryParams {
  eventId: string;
  ticketId: string;
  quantity: number;
  addressId: string;
}

export const GetSelfEventTicketCouponIntent = async ({
  eventId,
  ticketId,
  quantity,
  addressId,
  clientApiParams,
}: GetSelfEventTicketCouponIntentProps): Promise<
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

export const useGetSelfEventTicketCouponIntent = (
  eventId: string = "",
  ticketId: string = "",
  quantity: number = 0,
  addressId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventTicketCouponIntent>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventTicketCouponIntent>
  >(
    SELF_EVENT_TICKET_COUPON_INTENT_QUERY_KEY(
      eventId,
      ticketId,
      quantity,
      addressId
    ),
    (params) =>
      GetSelfEventTicketCouponIntent({
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
