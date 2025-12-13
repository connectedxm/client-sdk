import { ConnectedXMResponse, TransferLog } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "TRANSFERS"];

export interface GetEventAttendeeTransfersLogsProps
  extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventAttendeeTransfersLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  clientApiParams,
}: GetEventAttendeeTransfersLogsProps): Promise<
  ConnectedXMResponse<TransferLog[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendee/transfers/logs`,
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

export const useGetEventAttendeeTransfersLogs = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
  >(
    EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeTransfersLogs({
        ...params,
        eventId,
      }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!eventId && (options?.enabled ?? true),
    }
  );
};
