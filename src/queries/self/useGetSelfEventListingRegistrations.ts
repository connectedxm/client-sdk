import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { Registration } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_EVENT_LISTING_QUERY_KEY } from "./useGetSelfEventListing";

export const SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  checkedIn?: boolean
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
  locale,
}: GetSelfEventListingRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
  const clientApi = await ClientAPI(locale);
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
  checkedIn?: boolean
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ConnectedXMResponse<Registration[]>>(
    SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingRegistrations({ eventId, checkedIn, ...params }),
    {
      enabled: !!token && !!eventId,
    }
  );
};

export default useGetSelfEventListingsRegistrations;
