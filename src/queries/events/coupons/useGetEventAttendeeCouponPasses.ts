import { ConnectedXMResponse, ManagedCouponPass } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_ATTENDEE_COUPON_QUERY_KEY } from "./useGetEventAttendeeCoupon";

export const EVENT_ATTENDEE_COUPON_PASSES_QUERY_KEY = (
  eventId: string,
  couponId: string
): QueryKey => [
  ...EVENT_ATTENDEE_COUPON_QUERY_KEY(eventId, couponId),
  "PASSES",
];

export interface GetEventAttendeeCouponPassesProps
  extends InfiniteQueryParams {
  eventId: string;
  couponId: string;
}

export const GetEventAttendeeCouponPasses = async ({
  eventId,
  couponId,
  clientApiParams,
}: GetEventAttendeeCouponPassesProps): Promise<
  ConnectedXMResponse<ManagedCouponPass[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/coupons/${couponId}/passes`,
    {}
  );

  return data;
};

export const useGetEventAttendeeCouponPasses = (
  eventId: string = "",
  couponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeCouponPasses>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeCouponPasses>>
  >(
    EVENT_ATTENDEE_COUPON_PASSES_QUERY_KEY(eventId, couponId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeCouponPasses({
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
