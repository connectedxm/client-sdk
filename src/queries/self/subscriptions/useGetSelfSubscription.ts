import { ConnectedXMResponse } from "@interfaces";
import type { Subscription } from "@interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { SELF_SUBSCRIPTIONS_QUERY_KEY } from "./useGetSelfSubscriptions";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_SUBSCRIPTION_QUERY_KEY = (
  subscriptionId: string
): QueryKey => [...SELF_SUBSCRIPTIONS_QUERY_KEY(), subscriptionId];

export interface GetSelfSubcriptionProps extends SingleQueryParams {
  subscriptionId: string;
}

export const GetSelfSubcription = async ({
  subscriptionId,
  clientApiParams,
}: GetSelfSubcriptionProps): Promise<ConnectedXMResponse<Subscription>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/subscriptions/${subscriptionId}`);
  return data;
};

export const useGetSelfSubcription = (
  subscriptionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSelfSubcription>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfSubcription>>(
    SELF_SUBSCRIPTION_QUERY_KEY(subscriptionId),
    (params) => GetSelfSubcription({ subscriptionId, ...params }),
    {
      ...options,
      enabled:
        !!authenticated && !!subscriptionId && (options?.enabled ?? true),
    }
  );
};
