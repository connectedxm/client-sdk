import { ConnectedXMResponse, Coupon } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import { CacheIndividualQueries } from "@src/utilities";
import { SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY } from "./useGetSelfEventRegistrationCoupon";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

export const SELF_EVENT_REGISTRATION_COUPONS_QUERY_KEY = (
  eventId: string,
  registrationId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
  "COUPONS",
];

export interface GetSelfEventRegistrationCouponsProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
}

export const GetSelfEventRegistrationCoupons = async ({
  eventId,
  registrationId,
  clientApiParams,
  queryClient,
  locale,
}: GetSelfEventRegistrationCouponsProps): Promise<
  ConnectedXMResponse<Coupon[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/coupons`,
    {}
  );

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (couponId) =>
        SELF_EVENT_REGISTRATION_COUPON_QUERY_KEY(
          eventId,
          registrationId,
          couponId
        ),
      locale
    );
  }

  return data;
};

export const useGetSelfEventRegistrationCoupons = (
  eventId: string,
  registrationId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCoupons>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCoupons>>
  >(
    SELF_EVENT_REGISTRATION_COUPONS_QUERY_KEY(eventId, registrationId),
    (params: InfiniteQueryParams) =>
      GetSelfEventRegistrationCoupons({
        eventId,
        registrationId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!registrationId &&
        (options?.enabled ?? true),
    }
  );
};
