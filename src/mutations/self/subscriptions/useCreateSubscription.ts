import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface CreateSubscriptionParams extends MutationParams {
  productId: string;
  priceId: string;
}

export interface CreateSubscriptionResponse {
  clientSecret: string;
}

export const CreateSubscription = async ({
  productId,
  priceId,
  clientApiParams,
}: CreateSubscriptionParams): Promise<
  ConnectedXMResponse<CreateSubscriptionResponse>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSubscription>>,
      Omit<CreateSubscriptionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSubscriptionParams,
    Awaited<ReturnType<typeof CreateSubscription>>
  >(CreateSubscription, options);
};
