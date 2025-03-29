import { Booking } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const BOOKINGS_QUERY_KEY = (
  past?: boolean,
  placeId?: string
): QueryKey => {
  const keys = ["BOOKINGS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  if (placeId) {
    keys.push(placeId);
  }
  return keys;
};

export interface GetBookingsParams extends InfiniteQueryParams {
  past?: boolean;
  placeId?: string;
}

export const GetBookings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  placeId,
  clientApiParams,
}: GetBookingsParams): Promise<ConnectedXMResponse<Booking[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/bookings`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: past !== undefined ? past : undefined,
      placeId: placeId || undefined,
    },
  });

  return data;
};

export const useGetBookings = (
  past: boolean = false,
  placeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBookings>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBookings>>>(
    BOOKINGS_QUERY_KEY(past, placeId),
    (params: InfiniteQueryParams) => GetBookings({ past, placeId, ...params }),
    params,
    options
  );
};
