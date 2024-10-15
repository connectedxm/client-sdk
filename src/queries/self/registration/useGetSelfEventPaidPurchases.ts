import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_QUERY_KEY } from "@src/queries/events";

export const SELF_EVENT_PAID_PURCHASES_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_QUERY_KEY(eventId), "PAID_PURCHASES"];

export interface GetSelfEventPaidPurchasesProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventPaidPurchases = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventPaidPurchasesProps): Promise<
  ConnectedXMResponse<Purchase[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/events/${eventId}/purchases`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSelfEventPaidPurchases = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventPaidPurchases>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventPaidPurchases>>
  >(
    SELF_EVENT_PAID_PURCHASES_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventPaidPurchases({
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
