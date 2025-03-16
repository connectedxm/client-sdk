import type { Faq } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "./useGetEventFAQSection";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
): QueryKey => [
  ...EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
  "FAQ_SECTION_QUESTIONS",
];

export interface GetEventFaqsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventFaqs = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventFaqsProps): Promise<ConnectedXMResponse<Faq[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/events/${eventId}/faqs/${sectionId}/questions`,
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

export const useGetEventFaqs = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetEventFaqs>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetEventFaqs>>>(
    EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventFaqs({ eventId, sectionId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options?.enabled ?? true),
    }
  );
};
