import { ConnectedXMResponse, TransferLog } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

export const EVENT_PASS_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  attendeeId: string
): QueryKey => ["EVENT_PASS_TRANSFER_LOGS", eventId, attendeeId];

export interface useGetEventAttendeeTransfersLogsProps
  extends InfiniteQueryParams {
  eventId: string;
  attendeeId: string;
}

export const GetEventAttendeeTransfersLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  attendeeId,
  clientApiParams,
}: useGetEventAttendeeTransfersLogsProps): Promise<
  ConnectedXMResponse<TransferLog[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/attendees/${attendeeId}/transfers/logs`,
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
  attendeeId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventAttendeeTransfersLogs>>
  >(
    EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(eventId, attendeeId),
    (params: InfiniteQueryParams) =>
      GetEventAttendeeTransfersLogs({
        ...params,
        eventId,
        attendeeId,
      }),
    params,
    {
      ...options,
      enabled:
        !!authenticated &&
        !!eventId &&
        !!attendeeId &&
        (options?.enabled ?? true),
    }
  );
};
