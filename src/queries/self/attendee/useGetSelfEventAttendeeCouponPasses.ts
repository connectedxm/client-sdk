import { ConnectedXMResponse, ManagedCouponPass } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY } from "./useGetSelfEventAttendeeCoupon";

export const SELF_EVENT_ATTENDEE_COUPON_PASSES_QUERY_KEY = (
  eventId: string,
  couponId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY(eventId, couponId),
  "PASSES",
];

export interface GetSelfEventAttendeeCouponPassesProps
  extends InfiniteQueryParams {
  eventId: string;
  couponId: string;
}

export const GetSelfEventAttendeeCouponPasses = async ({
  eventId,
  couponId,
  clientApiParams,
}: GetSelfEventAttendeeCouponPassesProps): Promise<
  ConnectedXMResponse<ManagedCouponPass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/coupons/${couponId}/passes`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeeCouponPasses = (
  eventId: string = "",
  couponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventAttendeeCouponPasses>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventAttendeeCouponPasses>>
  >(
    SELF_EVENT_ATTENDEE_COUPON_PASSES_QUERY_KEY(eventId, couponId),
    (params: InfiniteQueryParams) =>
      GetSelfEventAttendeeCouponPasses({
        eventId,
        couponId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!couponId &&
        (options?.enabled ?? true),
    }
  );
};
