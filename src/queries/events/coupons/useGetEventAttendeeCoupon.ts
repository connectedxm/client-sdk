import { ConnectedXMResponse, ManagedCoupon } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { EVENT_ATTENDEE_COUPONS_QUERY_KEY } from "./useGetEventAttendeeCoupons";

export const EVENT_ATTENDEE_COUPON_QUERY_KEY = (
  eventId: string,
  couponId: string
): QueryKey => [EVENT_ATTENDEE_COUPONS_QUERY_KEY(eventId), couponId];

export const SET_EVENT_ATTENDEE_COUPON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ATTENDEE_COUPON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAttendeeCoupon>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_ATTENDEE_COUPON_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventAttendeeCouponProps extends SingleQueryParams {
  eventId: string;
  couponId: string;
}

export const GetEventAttendeeCoupon = async ({
  eventId,
  couponId,
  clientApiParams,
}: GetEventAttendeeCouponProps): Promise<
  ConnectedXMResponse<ManagedCoupon>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/coupons/${couponId}`,
    {}
  );

  return data;
};

export const useGetEventAttendeeCoupon = (
  eventId: string = "",
  couponId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventAttendeeCoupon>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetEventAttendeeCoupon>>(
    EVENT_ATTENDEE_COUPON_QUERY_KEY(eventId, couponId),
    (params: SingleQueryParams) =>
      GetEventAttendeeCoupon({
        eventId,
        couponId,
        ...params,
      }),
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
