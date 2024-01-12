import { ClientAPI } from "@src/ClientAPI";
import type { Event } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { SET_EVENT_QUERY_DATA } from "./useGetEvent";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "./useGetEvents";

export const EVENTS_FEATURED_QUERY_KEY = () => [
  ...EVENTS_QUERY_KEY(),
  "FEATURED",
];

export const SET_EVENTS_FEATURED_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENTS_FEATURED_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetFeaturedEvents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENTS_FEATURED_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetFeaturedEventsProps extends InfiniteQueryParams {}

export const GetFeaturedEvents = async ({
  pageParam,
  pageSize,
  orderBy,
  locale,
}: GetFeaturedEventsProps): Promise<ConnectedXMResponse<Event[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events/featured`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
    },
  });
  return data;
};

const useGetFeaturedEvents = () => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetFeaturedEvents>>
  >(
    EVENTS_FEATURED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetFeaturedEvents({ ...params }),
    {
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (eventId) => [eventId],
          SET_EVENT_QUERY_DATA
        ),
    }
  );
};

export default useGetFeaturedEvents;
