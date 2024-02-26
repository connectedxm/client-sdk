import type { ConnectedXMResponse, Registration } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_EVENT_LISTING_QUERY_KEY } from "./useGetSelfEventListing";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  checkedIn: boolean
) => [
  ...SELF_EVENT_LISTING_QUERY_KEY(eventId),
  "REGISTRATIONS",
  checkedIn ? "CHECKED_IN" : "ALL",
];

export interface GetSelfEventListingRegistrationsProps
  extends InfiniteQueryParams {
  eventId: string;
  checkedIn?: boolean;
}

export const GetSelfEventListingRegistrations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  checkedIn,
  clientApiParams,
}: GetSelfEventListingRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/listings/${eventId}/registrations`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        checkedIn: checkedIn ? "true" : undefined,
      },
    }
  );
  return data;
};

export const useGetSelfEventListingsRegistrations = (
  eventId: string,
  checkedIn: boolean = false,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  >(
    SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingRegistrations({ eventId, checkedIn, ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
