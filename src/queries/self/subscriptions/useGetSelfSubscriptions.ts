import { ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { Subscription, SubscriptionStatus } from "@interfaces";
import { useConnectedXM } from "@src/hooks";
import { CacheIndividualQueries } from "@src/utilities";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "./useGetSelfSubscription";

export const SELF_SUBSCRIPTIONS_QUERY_KEY = (status?: SubscriptionStatus) => {
  const key = [...SELF_QUERY_KEY(), "SUBSCRIPTIONS"];
  if (status) {
    key.push(status);
  }
  return key;
};

export interface GetSelfSubscriptionsProps extends InfiniteQueryParams {
  status?: SubscriptionStatus;
}

export const GetSelfSubscriptions = async ({
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetSelfSubscriptionsProps): Promise<ConnectedXMResponse<Subscription[]>> => {
  const { data } = await clientApi.get(`/self/subscriptions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });

  if (queryClient) {
    CacheIndividualQueries(
      data,
      queryClient,
      (subscriptionId: string) => SELF_SUBSCRIPTION_QUERY_KEY(subscriptionId),
      locale
    );
  }

  return data;
};

export const useGetSelfSubscriptions = (
  status?: SubscriptionStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfSubscriptions>>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfSubscriptions>>
  >(
    SELF_SUBSCRIPTIONS_QUERY_KEY(status),
    (params: InfiniteQueryParams) =>
      GetSelfSubscriptions({ status, ...params }),
    params,
    {
      ...options,
      enabled: !!token,
    }
  );
};
