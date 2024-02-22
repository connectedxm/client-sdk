import { ConnectedXMResponse } from "@interfaces";
import type { Subscription } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { SELF_SUBSCRIPTIONS_QUERY_KEY } from "./useGetSelfSubscriptions";
import { useConnectedXM } from "@src/hooks";
import { QueryKey } from "@tanstack/react-query";

export const SELF_SUBSCRIPTION_QUERY_KEY = (
  subscriptionId: string
): QueryKey => [...SELF_SUBSCRIPTIONS_QUERY_KEY(), subscriptionId];

interface GetSelfSubcriptionProps extends SingleQueryParams {
  subscriptionId: string;
}

export const GetSelfSubcription = async ({
  subscriptionId,
  clientApi,
}: GetSelfSubcriptionProps): Promise<ConnectedXMResponse<Subscription>> => {
  const { data } = await clientApi.get(`/self/subscriptions/${subscriptionId}`);
  return data;
};

const useGetSelfSubcription = (
  subscriptionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfSubcription>>
) => {
  const { token } = useConnectedXM();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfSubcription>>(
    SELF_SUBSCRIPTION_QUERY_KEY(subscriptionId),
    (params) => GetSelfSubcription({ subscriptionId, ...params }),
    {
      ...options,
      enabled: !!token && !!subscriptionId,
    }
  );
};

export default useGetSelfSubcription;
