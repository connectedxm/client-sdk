import { ConnectedXMResponse, ManagedCoupon } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SELF_EVENT_ATTENDEE_COUPONS_QUERY_KEY } from "./useGetSelfEventAttendeeCoupons";

export const SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY = (
  eventId: string,
  couponId: string
): QueryKey => [SELF_EVENT_ATTENDEE_COUPONS_QUERY_KEY(eventId), couponId];

export const SET_SELF_EVENT_REGISTRATION_COUPON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventAttendeeCoupon>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfEventAttendeeCouponProps extends SingleQueryParams {
  eventId: string;
  couponId: string;
}

export const GetSelfEventAttendeeCoupon = async ({
  eventId,
  couponId,
  clientApiParams,
}: GetSelfEventAttendeeCouponProps): Promise<
  ConnectedXMResponse<ManagedCoupon>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/coupons/${couponId}`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeeCoupon = (
  eventId: string = "",
  couponId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventAttendeeCoupon>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfEventAttendeeCoupon>>(
    SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY(eventId, couponId),
    (params: SingleQueryParams) =>
      GetSelfEventAttendeeCoupon({
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
