import { ConnectedXMResponse, ManagedCoupon } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_COUPONS_QUERY_KEY } from "./useGetSelfEventRegistrationCoupons";

export const SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  couponId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_COUPONS_QUERY_KEY(eventId, registrationId),
  couponId,
];

export const SET_SELF_EVENT_REGISTRATION_COUPON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfEventRegistrationCoupon>>,
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

export interface GetSelfEventRegistrationCouponProps extends SingleQueryParams {
  eventId: string;
  registrationId: string;
  couponId: string;
}

export const GetSelfEventRegistrationCoupon = async ({
  eventId,
  registrationId,
  couponId,
  clientApiParams,
}: GetSelfEventRegistrationCouponProps): Promise<
  ConnectedXMResponse<ManagedCoupon>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/coupons/${couponId}`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationCoupon = (
  eventId: string = "",
  registrationId: string = "",
  couponId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetSelfEventRegistrationCoupon>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSelfEventRegistrationCoupon>
  >(
    SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY(eventId, registrationId, couponId),
    (params: SingleQueryParams) =>
      GetSelfEventRegistrationCoupon({
        eventId,
        registrationId,
        couponId,
        ...params,
      }),
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
