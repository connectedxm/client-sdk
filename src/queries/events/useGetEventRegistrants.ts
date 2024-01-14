import { ClientAPI } from "@src/ClientAPI";
import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient } from "@tanstack/react-query";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { GetEventSessions } from "./useGetEventSessions";
import {
  ACCOUNT_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "../accounts/useGetAccount";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_REGISTRANTS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "REGISTRANTS",
];

export const SET_EVENT_REGISTRANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessions>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_REGISTRANTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventRegistrantsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventRegistrants = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
  queryClient,
}: GetEventRegistrantsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events/${eventId}/registrants`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (accountId) => ACCOUNT_QUERY_KEY(accountId),
      SET_ACCOUNT_QUERY_DATA
    );
  }

  return data;
};

const useGetEventRegistrants = (
  eventId: string,
  params: InfiniteQueryParams,
  options: InfiniteQueryOptions<ReturnType<typeof GetEventRegistrants>> = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<ReturnType<typeof GetEventRegistrants>>(
    EVENT_REGISTRANTS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventRegistrants({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!token && !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventRegistrants;
