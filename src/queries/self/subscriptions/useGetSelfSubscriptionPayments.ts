import { GetClientAPI } from "@src/ClientAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "./useGetSelfSubscription";
import { ConnectedXMResponse, Payment } from "@interfaces";

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
  clientApiParams,
}: GetSelfSubscriptionPaymentsProps): Promise<
  ConnectedXMResponse<Payment[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfSubscriptionPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfSubscriptionPayments>>
  >(
    SELF_SUBSCRIPTION_PAYMENTS_QUERY_KEY(subscriptionId),
    (params: InfiniteQueryParams) =>
      GetSelfSubscriptionPayments({ ...params, subscriptionId }),
    params,

    {
      ...options,
    }
  );
};
