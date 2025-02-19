import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { BOOKING_QUERY_KEY } from "./useGetBooking";
import { ConnectedXMResponse, PaymentIntent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_BOOKING_INTENT_QUERY_KEY = (
  bookingId: string,
  addressId: string
) => [...BOOKING_QUERY_KEY(bookingId), addressId, "INTENT"];

export interface GetBookingIntentProps extends SingleQueryParams {
  bookingId: string;
  addressId: string;
}

export const GetBookingIntent = async ({
  bookingId,
  addressId,
  clientApiParams,
}: GetBookingIntentProps): Promise<
  Awaited<ConnectedXMResponse<PaymentIntent>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings/${bookingId}/intent`, {
    params: {
      addressId,
    },
  });
  return data;
};

export const useGetBookingIntent = (
  bookingId: string = "",
  addressId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetBookingIntent>> = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetBookingIntent>>(
    SELF_BOOKING_INTENT_QUERY_KEY(bookingId, addressId),
    (params) => GetBookingIntent({ bookingId, addressId, ...params }),
    {
      staleTime: Infinity,
      retry: false,
      retryOnMount: false,
      ...options,
      enabled:
        !!authenticated &&
        !!bookingId &&
        !!addressId &&
        (options?.enabled ?? true),
    }
  );
};
