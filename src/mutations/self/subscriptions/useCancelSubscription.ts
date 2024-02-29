import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "@src/queries/self/subscriptions/useGetSelfSubscription";
import { SELF_SUBSCRIPTIONS_QUERY_KEY } from "@src/queries/self/subscriptions/useGetSelfSubscriptions";

export interface CancelSubscriptionParams extends MutationParams {
  subscriptionId: string;
}

export const CancelSubscription = async ({
  subscriptionId,
  clientApiParams,
  queryClient,
}: CancelSubscriptionParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/subscriptions/${subscriptionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_SUBSCRIPTIONS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_SUBSCRIPTION_QUERY_KEY(subscriptionId),
    });
  }

  return data;
};

export const useCancelSubscription = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelSubscription>>,
      Omit<CancelSubscriptionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelSubscriptionParams,
    Awaited<ReturnType<typeof CancelSubscription>>
  >(CancelSubscription, options);
};
