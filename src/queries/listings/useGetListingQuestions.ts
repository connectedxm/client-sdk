import type { ConnectedXMResponse, RegistrationQuestion } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { LISTING_QUERY_KEY } from "./useGetListing";
import { GetClientAPI } from "@src/ClientAPI";

export const LISTING_QUESTIONS_QUERY_KEY = (eventId: string) => [
  ...LISTING_QUERY_KEY(eventId),
  "QUESTIONS",
];

export interface GetSelfEventListingQuestionsProps extends InfiniteQueryParams {
  eventId: string;
}

export const GetSelfEventListingQuestions = async ({
  eventId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfEventListingQuestionsProps): Promise<
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

export const useGetSelfEventListingQuestions = (
  eventId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfEventListingQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfEventListingQuestions>>
  >(
    LISTING_QUESTIONS_QUERY_KEY(eventId),
    (params: InfiniteQueryParams) =>
      GetSelfEventListingQuestions({ eventId, ...params }),
    params,
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
