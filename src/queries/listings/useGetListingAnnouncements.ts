import type { Announcement, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTING_ANNOUNCEMENTS_QUERY_KEY = (eventId: string) => [
  ...LISTING_QUERY_KEY(eventId),
  "ANNOUNCEMENTS",
];

export interface GetSelfEventListingAnnouncementsProps
  extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventListingAnnouncements = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventListingAnnouncementsProps): Promise<
  ConnectedXMResponse<Announcement[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/announcements`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfEventListingAnnouncements = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingAnnouncements>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingAnnouncements>>
  >(
    LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingAnnouncements({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
