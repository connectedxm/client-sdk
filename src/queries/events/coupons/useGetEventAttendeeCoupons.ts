import { ConnectedXMResponse, ManagedCoupon } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const EVENT_ATTENDEE_COUPONS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "COUPONS"];

export interface GetEventAttendeeCouponsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventAttendeeCoupons = async ({
  eventId,
  clientApiParams,
}: GetEventAttendeeCouponsProps): Promise<
  ConnectedXMResponse<ManagedCoupon[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/coupons`,
    {}
  );

  return data;
};

export const useGetEventAttendeeCoupons = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeCoupons>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeCoupons>>
  >(
    EVENT_ATTENDEE_COUPONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeCoupons({
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
