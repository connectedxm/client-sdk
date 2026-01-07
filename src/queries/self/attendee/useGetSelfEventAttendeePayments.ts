import { ConnectedXMResponse, Payment } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_EVENT_ATTENDEE_QUERY_KEY } from "./useGetSelfEventAttendee";

export const SELF_EVENT_ATTENDEE_PAYMENTS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "PAYMENTS"];

export interface GetSelfEventAttendeePaymentsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventAttendeePayments = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventAttendeePaymentsProps): Promise<
  ConnectedXMResponse<Payment[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/payments`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  return data;
};

export const useGetSelfEventAttendeePayments = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventAttendeePayments>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventAttendeePayments>>
  >(
    SELF_EVENT_ATTENDEE_PAYMENTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventAttendeePayments({
        eventId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
