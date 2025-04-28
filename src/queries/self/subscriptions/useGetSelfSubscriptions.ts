import { ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "../useGetSelf";
import { Subscription, SubscriptionStatus } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

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
  clientApiParams,
}: GetSelfSubscriptionsProps): Promise<ConnectedXMResponse<Subscription[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/subscriptions`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });

  return data;
};

export const useGetSelfSubscriptions = (
  status?: SubscriptionStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfSubscriptions>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfSubscriptions>>
  >(
    SELF_SUBSCRIPTIONS_QUERY_KEY(status),
    (params: InfiniteQueryParams) =>
      GetSelfSubscriptions({ status, ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
