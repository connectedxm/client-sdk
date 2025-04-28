import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { FaqSection } from "@interfaces";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "./useGetEventFAQSections";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_FAQ_SECTION_QUERY_KEY = (
  eventId: string,
  sectionId: string
): QueryKey => [...EVENT_FAQ_SECTIONS_QUERY_KEY(eventId), sectionId];

export interface GetEventFAQSectionProps extends SingleQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventFAQSection = async ({
  eventId,
  sectionId,
  clientApiParams,
}: GetEventFAQSectionProps): Promise<ConnectedXMResponse<FaqSection>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/events/${eventId}/faqs/${sectionId}`);
  return data;
};

export const useGetEventFAQSection = (
  eventId: string = "",
  sectionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventFAQSection>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventFAQSection>>(
    EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId),
    (params) => GetEventFAQSection({ eventId, sectionId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options?.enabled ?? true),
    }
  );
};
