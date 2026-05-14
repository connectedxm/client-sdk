import { ConnectedXMResponse, Payment } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_ATTENDEE_QUERY_KEY } from "../useGetEventAttendee";

export const EVENT_ATTENDEE_PAYMENTS_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_ATTENDEE_QUERY_KEY(eventId), "PAYMENTS"];

export interface GetEventAttendeePaymentsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventAttendeePayments = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventAttendeePaymentsProps): Promise<
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

export const useGetEventAttendeePayments = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeePayments>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeePayments>>
  >(
    EVENT_ATTENDEE_PAYMENTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeePayments({
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
