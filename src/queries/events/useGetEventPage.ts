import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import type { EventPage } from "@interfaces";
import { EVENT_PAGES_QUERY_KEY } from "./useGetEventPages";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_PAGE_QUERY_KEY = (eventId: string, pageId: string) => [
  ...EVENT_PAGES_QUERY_KEY(eventId),
  pageId,
];

export const SET_EVENT_PAGE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PAGE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPage>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_PAGE_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetEventPageProps extends SingleQueryParams {
  eventId: string;
  pageId: string;
}

export const GetEventPage = async ({
  eventId,
  pageId,
  locale,
}: GetEventPageProps): Promise<ConnectedXMResponse<EventPage>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/events/${eventId}/pages/${pageId}`);
  return data;
};

const useGetEventPage = (
  eventId: string,
  pageId: string,
  params: SingleQueryParams = {},
  options: SingleQueryOptions<ReturnType<typeof GetEventPage>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPage>>(
    EVENT_PAGE_QUERY_KEY(eventId, pageId),
    (params) => GetEventPage({ eventId, pageId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!pageId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventPage;
