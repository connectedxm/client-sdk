import { ConnectedXM, ConnectedXMResponse } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { Account } from "@interfaces";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { SET_ACCOUNT_QUERY_DATA } from "../accounts/useGetAccount";

export const SELF_RECOMMENDATIONS_QUERY_KEY = (
  type: string,
  eventId?: string
) => {
  let keys = [...SELF_QUERY_KEY(), "RECOMMENDATIONS", type];
  if (typeof eventId !== "undefined") keys.push(eventId);
  return keys;
};

export type RecomendationType = "following" | "contacts" | "popular";

interface GetSelfRecommendationsProps extends InfiniteQueryParams {
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
  locale,
}: GetSelfRecommendationsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await ClientAPI(locale);
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
  return data;
};

const useGetSelfRecommendations = (
  type: RecomendationType,
  eventId?: string
) => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfRecommendations>>
  >(
    SELF_RECOMMENDATIONS_QUERY_KEY(type, eventId),
    (params: InfiniteQueryParams) =>
      GetSelfRecommendations({ ...params, eventId, type }),
    {
      enabled: !!token,
      onSuccess: (data) => {
        CacheIndividualQueries(
          data,
          queryClient,
          (accountId: string) => [accountId],
          SET_ACCOUNT_QUERY_DATA
        );
      },
    }
  );
};

export default useGetSelfRecommendations;
