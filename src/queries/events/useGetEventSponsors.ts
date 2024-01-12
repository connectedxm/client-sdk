import { ClientAPI } from "@src/ClientAPI";
import type { Account } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { EVENT_TICKETS_QUERY_KEY } from "./useGetEventTickets";
import { SET_SPONSOR_QUERY_DATA } from "../sponsors/useGetSponsor";

export const EVENT_SPONSORS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "SPONSORS",
];

export const SET_EVENT_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventSponsorsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventSponsors = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetEventSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events/${eventId}/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetEventSponsors = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSponsors>>
  >(
    EVENT_TICKETS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) => GetEventSponsors({ eventId, ...params }),
    {
      enabled: !!eventId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (accountId) => [accountId],
          SET_SPONSOR_QUERY_DATA
        ),
    }
  );
};

export default useGetEventSponsors;
