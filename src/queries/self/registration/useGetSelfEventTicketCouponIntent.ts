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
  registrationId: string,
  ticketId: string,
  quantity: number
) => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  registrationId,
  "COUPON_INTENT",
  ticketId,
  quantity,
];

export interface GetSelfEventTicketCouponIntentProps extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  ticketId: string;
  quantity: number;
}

export const GetSelfEventTicketCouponIntent = async ({
  eventId,
  registrationId,
  ticketId,
  quantity,
  clientApiParams,
}: GetSelfEventTicketCouponIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/coupons/intent`,
    {
      params: {
        ticketId,
        quantity,
      },
    }
  );
  return data;
};

export const useGetSelfEventTicketCouponIntent = (
  eventId: string = "",
  registrationId: string = "",
  ticketId: string = "",
  quantity: number = 0,
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
      registrationId,
      ticketId,
      quantity
    ),
    (params) =>
      GetSelfEventTicketCouponIntent({
        eventId,
        registrationId,
        ticketId,
        quantity,
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
        !!registrationId &&
        !!ticketId &&
        !!quantity &&
        (options?.enabled ?? true),
    }
  );
};
