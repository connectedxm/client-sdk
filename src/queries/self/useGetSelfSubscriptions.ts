import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import { useAuthContext } from "@hooks/useAuthContext";
import {
  InfiniteParams,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { Subscription, SubscriptionStatus } from "@interfaces";

export const SELF_SUBSCRIPTIONS_QUERY_KEY = (status?: SubscriptionStatus) => {
  const key = [...SELF_QUERY_KEY(), "SUBSCRIPTIONS"];
  if (status) {
    key.push(status);
  }
  return key;
};

interface GetSelfSubscriptionsProps extends InfiniteQueryParams {
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

  return data;
};

const useGetSelfSubscriptions = (status?: SubscriptionStatus) => {
  const { token } = useAuthContext();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfSubscriptions>>
  >(
    SELF_SUBSCRIPTIONS_QUERY_KEY(status),
    (params: InfiniteParams) => GetSelfSubscriptions({ ...params, status }),
    {
      enabled: !!token,
    }
  );
};

export default useGetSelfSubscriptions;
