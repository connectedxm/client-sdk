import type { Announcement, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTING_ANNOUNCEMENTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_LISTING_QUERY_KEY(eventId),
  "ANNOUNCEMENTS",
];

export interface GetEventListingAnnouncementsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventListingAnnouncements = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventListingAnnouncementsProps): Promise<
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

export const useGetEventListingAnnouncements = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventListingAnnouncements>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventListingAnnouncements>>
  >(
    EVENT_LISTING_ANNOUNCEMENTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventListingAnnouncements({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
