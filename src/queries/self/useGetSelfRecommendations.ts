import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { Account, ConnectedXMResponse } from "@interfaces";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { ACCOUNT_QUERY_KEY } from "../accounts/useGetAccount";

export const SELF_RECOMMENDATIONS_QUERY_KEY = (
  type: string,
  eventId?: string
) => {
  const keys = [...SELF_QUERY_KEY(), "RECOMMENDATIONS", type];
  if (typeof eventId !== "undefined") keys.push(eventId);
  return keys;
};

export type RecomendationType = "following" | "contacts" | "popular";

export interface GetSelfRecommendationsProps extends InfiniteQueryParams {
  eventId?: string;
  type?: RecomendationType;
}

export const GetSelfRecommendations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  type,
  queryClient,
  clientApi,
  locale,
}: GetSelfRecommendationsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const { data } = await clientApi.get(`/self/recommendations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
      type: type || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (accountId: string) => ACCOUNT_QUERY_KEY(accountId),
      locale
    );
  }

  return data;
};

export const useGetSelfRecommendations = (
  type: RecomendationType,
  eventId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfRecommendations>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfRecommendations>>
  >(
    SELF_RECOMMENDATIONS_QUERY_KEY(type, eventId),
    (params: InfiniteQueryParams) =>
      GetSelfRecommendations({ ...params, eventId, type }),
    params,
    {
      ...options,
      enabled: !!token,
    }
  );
};
