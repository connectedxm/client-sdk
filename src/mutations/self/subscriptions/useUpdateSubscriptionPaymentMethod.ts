import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { SELF_SUBSCRIPTION_QUERY_KEY } from "@src/queries/self/subscriptions/useGetSelfSubscription";

export interface UpdateSubscriptionPaymentMethodParams extends MutationParams {
  subscriptionId: string;
  paymentMethodId: string;
}

export const UpdateSubscriptionPaymentMethod = async ({
  subscriptionId,
  paymentMethodId,
  clientApiParams,
  queryClient,
}: UpdateSubscriptionPaymentMethodParams): Promise<
  ConnectedXMResponse<null>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
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

export const useUpdateSubscriptionPaymentMethod = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSubscriptionPaymentMethod>>,
      Omit<
        UpdateSubscriptionPaymentMethodParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(UpdateSubscriptionPaymentMethod, options);
};
