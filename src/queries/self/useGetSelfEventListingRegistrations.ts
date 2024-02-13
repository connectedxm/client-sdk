import type { ConnectedXMResponse, Registration } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_EVENT_LISTING_QUERY_KEY } from "./useGetSelfEventListing";
import { useConnectedXM } from "@src/hooks";

export const SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  checkedIn: boolean
) => [
  ...SELF_EVENT_LISTING_QUERY_KEY(eventId),
  "REGISTRATIONS",
  checkedIn ? "CHECKED_IN" : "ALL",
];

interface GetSelfEventListingRegistrationsProps extends InfiniteQueryParams {
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
  clientApi,
}: GetSelfEventListingRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
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

const useGetSelfEventListingsRegistrations = (
  eventId: string,
  checkedIn: boolean = false,
  params: Omit<InfiniteQueryParams, "pageParam" | "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  >(
    SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingRegistrations({ eventId, checkedIn, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfEventListingsRegistrations;
