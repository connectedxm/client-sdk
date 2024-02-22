import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "@src/queries/self/subscriptions/useGetSelfSubscription";
import { SELF_SUBSCRIPTIONS_QUERY_KEY } from "@src/queries/self/subscriptions/useGetSelfSubscriptions";

interface CancelSubscriptionParams extends MutationParams {
  subscriptionId: string;
}
const CancelSubscription = async ({
  subscriptionId,
  clientApi,
  queryClient,
}: CancelSubscriptionParams): Promise<ConnectedXMResponse<null>> => {
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

const useCancelSubscription = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelSubscription>>,
      Omit<CancelSubscriptionParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelSubscriptionParams,
    Awaited<ReturnType<typeof CancelSubscription>>
  >(CancelSubscription, params, options);
};

export default useCancelSubscription;
