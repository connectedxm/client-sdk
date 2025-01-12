import type { Account } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_ACTIVATIONS_LEADERBOARD_QUERY_KEY = (
  eventId: string
): QueryKey => [...EVENT_QUERY_KEY(eventId), "ACTIVATIONS_LEADERBOARD"];

export interface GetEventActivationLeaderboardsProps
  extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventActivationLeaderboards = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventActivationLeaderboardsProps): Promise<
  ConnectedXMResponse<Account[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/activations/leaderboard`,
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

export const useGetEventActivationLeaderboards = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventActivationLeaderboards>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventActivationLeaderboards>>
  >(
    EVENT_ACTIVATIONS_LEADERBOARD_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventActivationLeaderboards({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
