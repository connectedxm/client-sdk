import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import type { BaseEvent, Series } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export interface EventsExploreData {
  featuredEvents: BaseEvent[];
  featuredSeries: (Series & { events: BaseEvent[] })[];
  upcomingEvents: BaseEvent[];
  pastEvents: BaseEvent[];
}

export const EVENTS_EXPLORE_QUERY_KEY = (): QueryKey => ["EVENTS_EXPLORE"];

export const SET_EVENTS_EXPLORE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENTS_EXPLORE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventsExplore>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENTS_EXPLORE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetEventsExploreProps extends SingleQueryParams {}

export const GetEventsExplore = async ({
  clientApiParams,
}: GetEventsExploreProps): Promise<ConnectedXMResponse<EventsExploreData>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/explore`);
  return data;
};

export const useGetEventsExplore = (
  options: SingleQueryOptions<ReturnType<typeof GetEventsExplore>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventsExplore>>(
    EVENTS_EXPLORE_QUERY_KEY(),
    (params) => GetEventsExplore({ ...params }),
    options
  );
};
