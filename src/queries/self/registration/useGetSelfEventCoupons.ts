import { ConnectedXMResponse, ManagedCoupon } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

export const SELF_EVENT_COUPONS_QUERY_KEY = (eventId: string): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "COUPONS",
];

export interface GetSelfEventCouponsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventCoupons = async ({
  eventId,
  clientApiParams,
}: GetSelfEventCouponsProps): Promise<ConnectedXMResponse<ManagedCoupon[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/registration/coupons`,
    {}
  );

  return data;
};

export const useGetSelfEventCoupons = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventCoupons>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventCoupons>>
  >(
    SELF_EVENT_COUPONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventCoupons({
        eventId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
