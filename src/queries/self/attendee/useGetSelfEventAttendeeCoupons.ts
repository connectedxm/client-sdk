import { ConnectedXMResponse, ManagedCoupon } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_COUPONS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "COUPONS"];

export interface GetSelfEventAttendeeCouponsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventAttendeeCoupons = async ({
  eventId,
  clientApiParams,
}: GetSelfEventAttendeeCouponsProps): Promise<
  ConnectedXMResponse<ManagedCoupon[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/coupons`,
    {}
  );

  return data;
};

export const useGetSelfEventAttendeeCoupons = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventAttendeeCoupons>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventAttendeeCoupons>>
  >(
    SELF_EVENT_ATTENDEE_COUPONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventAttendeeCoupons({
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
