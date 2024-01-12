import { ClientAPI } from "@src/ClientAPI";
import type { FaqSection } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { EVENT_QUERY_KEY } from "./useGetEvent";
import { SET_EVENT_FAQ_SECTION_QUERY_DATA } from "./useGetEventFAQSection";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_FAQ_SECTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "FAQ_SECTIONS",
];

export const SET_EVENT_FAQ_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFaqSections>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_FAQ_SECTIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetEventFaqSectionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventFaqSections = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetEventFaqSectionsProps): Promise<ConnectedXMResponse<FaqSection[]>> => {
  const clientApi = await ClientAPI(locale);
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

const useGetEventFaqSections = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventFaqSections>>
  >(
    EVENT_FAQ_SECTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventFaqSections({ eventId, ...params }),
    {
      enabled: !!eventId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (sectionId) => [eventId, sectionId],
          SET_EVENT_FAQ_SECTION_QUERY_DATA
        ),
    }
  );
};

export default useGetEventFaqSections;
