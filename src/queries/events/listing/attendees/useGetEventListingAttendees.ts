import type {
  ConnectedXMResponse,
  EventRegistration,
  PurchaseStatus,
} from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTING_ATTENDEES_QUERY_KEY = (
  eventId: string,
  status?: keyof typeof PurchaseStatus
) => [...EVENT_LISTING_QUERY_KEY(eventId), "ATTENDEES", status ?? "ALL"];

export interface GetEventListingAttendeesProps extends InfiniteQueryParams {
  eventId: string;
  status?: keyof typeof PurchaseStatus;
}

export const GetEventListingAttendees = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  clientApiParams,
}: GetEventListingAttendeesProps): Promise<
  ConnectedXMResponse<EventRegistration[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/attendees`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};

export const useGetEventListingAttendees = (
  eventId: string,
  status?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventListingAttendees>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventListingAttendees>>
  >(
    EVENT_LISTING_ATTENDEES_QUERY_KEY(eventId, status),
    (params: InfiniteQueryParams) =>
      GetEventListingAttendees({ eventId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
