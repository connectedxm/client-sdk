import type {
  ConnectedXMResponse,
  Registration,
  RegistrationStatus,
} from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_EVENT_LISTING_QUERY_KEY } from "./useGetSelfEventListing";
import { GetClientAPI } from "@src/ClientAPI";

export const SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY = (
  eventId: string,
  status?: keyof typeof RegistrationStatus
) => [
  ...SELF_EVENT_LISTING_QUERY_KEY(eventId),
  "REGISTRATIONS",
  status ?? "ALL",
];

export interface GetSelfEventListingRegistrationsProps
  extends InfiniteQueryParams {
  eventId: string;
  status?: keyof typeof RegistrationStatus;
}

export const GetSelfEventListingRegistrations = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
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
        status: status || undefined,
      },
    }
  );
  return data;
};

export const useGetSelfEventListingsRegistrations = (
  eventId: string,
  status?: keyof typeof RegistrationStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingRegistrations>>
  >(
    SELF_EVENT_LISTING_REGISTRATIONS_QUERY_KEY(eventId, status),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingRegistrations({ eventId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
