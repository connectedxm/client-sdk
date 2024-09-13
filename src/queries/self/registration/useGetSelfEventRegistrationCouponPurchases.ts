import { ConnectedXMResponse, ManagedCouponPurchase } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY } from "./useGetSelfEventRegistrationCoupon";

export const SELF_EVENT_REGISTRATION_COUPON_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  couponId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY(
    eventId,
    registrationId,
    couponId
  ),
  "PURCHASES",
];

export interface GetSelfEventRegistrationCouponPurchasesProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  couponId: string;
}

export const GetSelfEventRegistrationCouponPurchases = async ({
  eventId,
  registrationId,
  couponId,
  clientApiParams,
}: GetSelfEventRegistrationCouponPurchasesProps): Promise<
  ConnectedXMResponse<ManagedCouponPurchase[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/coupons/${couponId}/purchases`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationCouponPurchases = (
  eventId: string = "",
  registrationId: string = "",
  couponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCouponPurchases>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCouponPurchases>>
  >(
    SELF_EVENT_REGISTRATION_COUPON_REGISTRATIONS_QUERY_KEY(
      eventId,
      registrationId,
      couponId
    ),
    (params: InfiniteQueryParams) =>
      GetSelfEventRegistrationCouponPurchases({
        eventId,
        registrationId,
        couponId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        !!couponId &&
        (options?.enabled ?? true),
    }
  );
};
