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

export const EVENT_TRANSFER_LOGS_QUERY_KEY = (eventId: string): QueryKey => [
  ...SELF_EVENT_REGISTRATION_QUERY_KEY(eventId),
  "TRANSFERS",
];

export interface GetSelfEventTransfersLogsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventTransfersLogs = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  clientApiParams,
}: GetSelfEventTransfersLogsProps): Promise<
  ConnectedXMResponse<TransferLog[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/self/events/${eventId}/transfers/logs`,
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

export const useGetSelfEventTransfersLogs = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventTransfersLogs>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventTransfersLogs>>
  >(
    EVENT_TRANSFER_LOGS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventTransfersLogs({
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
