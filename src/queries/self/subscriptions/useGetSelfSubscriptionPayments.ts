import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "./useGetSelfSubscription";
import { ConnectedXMResponse, Payment } from "@interfaces";
import { useConnectedXM } from "@src/hooks";

export const SELF_SUBSCRIPTION_PAYMENTS_QUERY_KEY = (
  subscriptionId: string
) => [...SELF_SUBSCRIPTION_QUERY_KEY(subscriptionId), "PAYMENTS"];

export interface GetSelfSubscriptionPaymentsProps extends InfiniteQueryParams {
  subscriptionId: string;
}

export const GetSelfSubscriptionPayments = async ({
  subscriptionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApi,
}: GetSelfSubscriptionPaymentsProps): Promise<
  ConnectedXMResponse<Payment[]>
> => {
  const { data } = await clientApi.get(
    `/self/subscriptions/${subscriptionId}/payments`,
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

export const useGetSelfSubscriptionPayments = (
  subscriptionId: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfSubscriptionPayments>>
  > = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfSubscriptionPayments>>
  >(
    SELF_SUBSCRIPTION_PAYMENTS_QUERY_KEY(subscriptionId),
    (params: InfiniteQueryParams) =>
      GetSelfSubscriptionPayments({ ...params, subscriptionId }),
    params,

    {
      ...options,
      enabled: !!token,
    }
  );
};
