import { ConnectedXMResponse, TransferLog } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_ATTENDEE_QUERY_KEY as SELF_EVENT_ATTENDEE_QUERY_KEY } from "../attendee/useGetEventAttendee";

export const SELF_EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string
): QueryKey => [...SELF_EVENT_ATTENDEE_QUERY_KEY(eventId), "TRANSFERS"];

export interface GetSelfEventAttendeeTransfersLogsProps
  extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventAttendeeTransfersLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  clientApiParams,
}: GetSelfEventAttendeeTransfersLogsProps): Promise<
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

export const useGetSelfEventAttendeeTransfersLogs = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventAttendeeTransfersLogs>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventAttendeeTransfersLogs>>
  >(
    SELF_EVENT_ATTENDEE_TRANSFER_LOGS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventAttendeeTransfersLogs({
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
