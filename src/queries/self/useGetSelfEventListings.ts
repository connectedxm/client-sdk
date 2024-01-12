import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { Event, EventListing } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SET_SELF_EVENT_LISTING_QUERY_DATA } from "./useGetSelfEventListing";

export const SELF_EVENT_LISTINGS_QUERY_KEY = (past?: boolean) => {
  let keys = [...SELF_QUERY_KEY(), "EVENT_LISTINGS"];
  if (typeof past !== "undefined") {
    keys.push(past ? "PAST" : "UPCOMING");
  }
  return keys;
};

interface GetSelfEventListingsProps extends InfiniteQueryParams {
  past?: boolean;
}

export const GetSelfEventListings = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  past,
  locale,
}: GetSelfEventListingsProps): Promise<ConnectedXMResponse<EventListing[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/events/listings`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      past: typeof past == "boolean" ? past : undefined,
    },
  });
  return data;
};

const useGetSelfEventListings = (past?: boolean) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListings>>
  >(
    SELF_EVENT_LISTINGS_QUERY_KEY(past),
    (params: InfiniteQueryParams) => GetSelfEventListings({ past, ...params }),
    {
      enabled: !!token,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (eventId) => [eventId],
          SET_SELF_EVENT_LISTING_QUERY_DATA
        ),
    }
  );
};

export default useGetSelfEventListings;
