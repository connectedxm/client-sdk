import type { ConnectedXMResponse, EventPass } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_LISTING_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTING_PASSES_QUERY_KEY = (
  eventId: string,
  checkedIn?: boolean
) => [
  ...EVENT_LISTING_QUERY_KEY(eventId),
  "PURCHASES",
  typeof checkedIn !== "undefined" ? checkedIn : "ALL",
];

export interface GetEventListingPassesProps extends InfiniteQueryParams {
  eventId: string;
  checkedIn?: boolean;
}

export const GetEventListingPasses = async ({
  eventId,
  checkedIn,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventListingPassesProps): Promise<ConnectedXMResponse<EventPass[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/passes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      checkedIn,
    },
  });
  return data;
};

export const useGetEventListingPasses = (
  eventId: string,
  checkedIn?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventListingPasses>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventListingPasses>>
  >(
    EVENT_LISTING_PASSES_QUERY_KEY(eventId, checkedIn),
    (params: InfiniteQueryParams) =>
      GetEventListingPasses({ eventId, checkedIn, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
