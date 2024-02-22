import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface CreateSubscriptionParams extends MutationParams {
  subscriptionId: string;
  productId: string;
  priceId: string;
}

export interface CreateSubscriptionResponse {
  type: string;
  clientSecret: string;
}

export const CreateSubscription = async ({
  productId,
  priceId,
  clientApi,
}: CreateSubscriptionParams): Promise<
  ConnectedXMResponse<CreateSubscriptionResponse>
> => {
  const { data } = await clientApi.post<
    ConnectedXMResponse<CreateSubscriptionResponse>
  >("/self/subscriptions", {
    productId,
    priceId,
    quantity: 1,
  });

  return data;
};

export const useCreateSubscription = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSubscription>>,
      Omit<CreateSubscriptionParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSubscriptionParams,
    Awaited<ReturnType<typeof CreateSubscription>>
  >(CreateSubscription, params, options);
};
