import type { FaqSection } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_FAQ_SECTIONS_QUERY_KEY = (eventId: string): QueryKey => [
  ...EVENT_QUERY_KEY(eventId),
  "FAQ_SECTIONS",
];

export interface GetEventFaqSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventFaqSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventFaqSectionsProps): Promise<ConnectedXMResponse<FaqSection[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/faqs`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetEventFaqSections = (
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventFaqSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFaqSections>>
  >(
    EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventFaqSections({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
