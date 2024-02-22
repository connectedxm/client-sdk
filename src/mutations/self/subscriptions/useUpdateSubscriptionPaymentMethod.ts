import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "@src/queries/self/subscriptions/useGetSelfSubscription";

interface UpdateSubscriptionPaymentMethodParams extends MutationParams {
  subscriptionId: string;
  paymentMethodId: string;
}

const UpdateSubscriptionPaymentMethod = async ({
  subscriptionId,
  paymentMethodId,
  clientApi,
  queryClient,
}: UpdateSubscriptionPaymentMethodParams): Promise<
  ConnectedXMResponse<null>
> => {
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/self/subscriptions/${subscriptionId}/payment-method`,
    {
      paymentMethodId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_SUBSCRIPTION_QUERY_KEY(subscriptionId),
    });
  }
  return data;
};

const useUpdateSubscriptionPaymentMethod = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSubscriptionPaymentMethod>>,
      Omit<UpdateSubscriptionPaymentMethodParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(UpdateSubscriptionPaymentMethod, params, options);
};

export default useUpdateSubscriptionPaymentMethod;
