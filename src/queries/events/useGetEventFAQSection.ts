import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { FaqSection } from "@interfaces";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "./useGetEventFAQSections";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const EVENT_FAQ_SECTION_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_FAQ_SECTIONS_QUERY_KEY(eventId), sectionId];

export const SET_EVENT_FAQ_SECTION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_FAQ_SECTION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventFAQSection>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...EVENT_FAQ_SECTION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

interface GetEventFAQSectionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventFAQSection = async ({
  eventId,
  sectionId,
  clientApi,
}: GetEventFAQSectionProps): Promise<ConnectedXMResponse<FaqSection>> => {
  const { data } = await clientApi.get(`/events/${eventId}/faqs/${sectionId}`);
  return data;
};

const useGetEventFAQSection = (
  eventId: string,
  sectionId: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetEventFAQSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSection>>(
    EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    (params) => GetEventFAQSection({ eventId, sectionId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventFAQSection;
