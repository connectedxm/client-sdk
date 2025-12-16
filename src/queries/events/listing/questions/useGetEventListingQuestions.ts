import type { ConnectedXMResponse, RegistrationQuestion } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { EVENT_LISTING_QUERY_KEY } from "../../useGetEventListing";
import { GetClientAPI } from "@src/ClientAPI";

export const EVENT_LISTING_QUESTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_LISTING_QUERY_KEY(eventId),
  "QUESTIONS",
];

export interface GetEventListingQuestionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetEventListingQuestions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetEventListingQuestionsProps): Promise<
  ConnectedXMResponse<RegistrationQuestion[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/listings/${eventId}/questions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetEventListingQuestions = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventListingQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventListingQuestions>>
  >(
    EVENT_LISTING_QUESTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetEventListingQuestions({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
