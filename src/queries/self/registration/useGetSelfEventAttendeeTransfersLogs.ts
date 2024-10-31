import { ConnectedXMResponse, TransferLog } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_EVENT_REGISTRATION_QUERY_KEY } from "./useGetSelfEventRegistration";

export const EVENT_PASS_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  attendeeId: string
): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId, attendeeId),
  "TRANSFERS",
];

export interface GetSelfEventAttendeeTransfersLogsProps
  extends InfiniteQueryParams {
  eventId: string;
  attendeeId: string;
}

export const GetSelfEventAttendeeTransfersLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  attendeeId,
  clientApiParams,
}: GetSelfEventAttendeeTransfersLogsProps): Promise<
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

export const useGetSelfEventAttendeeTransfersLogs = (
  eventId: string,
  attendeeId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventAttendeeTransfersLogs>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventAttendeeTransfersLogs>>
  >(
    EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(eventId, attendeeId),
    (params: InfiniteQueryParams) =>
      GetSelfEventAttendeeTransfersLogs({
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
