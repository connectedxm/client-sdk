import { ConnectedXMResponse, Registration } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

export const SELF_EVENT_REGISTRATION_COUPON_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  registrationId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId, registrationId),
  "COUPONS",
];

export interface GetSelfEventRegistrationCouponRegistrationsProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  couponId: string;
}

export const GetSelfEventRegistrationCouponRegistrations = async ({
  eventId,
  registrationId,
  couponId,
  clientApiParams,
}: GetSelfEventRegistrationCouponRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/${registrationId}/coupons/${couponId}/registrations`,
    {}
  );

  return data;
};

export const useGetSelfEventRegistrationCouponRegistrations = (
  eventId: string = "",
  registrationId: string = "",
  couponId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCouponRegistrations>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventRegistrationCouponRegistrations>>
  >(
    SELF_EVENT_REGISTRATION_COUPON_REGISTRATIONS_QUERY_KEY(
      eventId,
      registrationId
    ),
    (params: InfiniteQueryParams) =>
      GetSelfEventRegistrationCouponRegistrations({
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
