import { ConnectedXMResponse, TransferLog } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import { CacheIndividualQueries } from "@src/utilities";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";

export const EVENT_PASS_TRANSFER_LOGS_QUERY_KEY = (
  eventId: string,
  passId: string,
  transferLogId?: string
): QueryKey => ["EVENT_PASS_TRANSFER_LOGS", eventId, passId, transferLogId];

export interface useGetEventPassTransferLogsProps extends InfiniteQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPassTransferLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  passId,
  clientApiParams,
  queryClient,
  locale,
}: useGetEventPassTransferLogsProps): Promise<
  ConnectedXMResponse<TransferLog[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/passes/${passId}/transfers/logs`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (transferLogId) =>
        EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(eventId, passId, transferLogId),
      locale
    );
  }

  return data;
};

export const useGetEventPassTransferLogs = (
  eventId: string,
  passId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventPassTransferLogs>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventPassTransferLogs>>
  >(
    EVENT_PASS_TRANSFER_LOGS_QUERY_KEY(eventId, passId),
    (params: InfiniteQueryParams) =>
      GetEventPassTransferLogs({
        ...params,
        eventId,
        passId,
      }),
    params,
    {
      ...options,
      enabled:
        !!authenticated && !!eventId && !!passId && (options?.enabled ?? true),
    }
  );
};
