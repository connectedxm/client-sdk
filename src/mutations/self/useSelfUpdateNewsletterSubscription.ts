import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { QUERY_KEY as SELF_NEWSLETTER_SUBSCRIPTIONS } from "@context/queries/self/useGetSelfNewsletterSubscriptions";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface SelfUpdateNewsletterSubscriptionParams extends MutationParams {
  newsletterId: string;
}

export const SelfUpdateNewsletterSubscription = async ({
  newsletterId,
}: SelfUpdateNewsletterSubscriptionParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/self/newsletters/${newsletterId}`);
  return data;
};

export const useSelfUpdateNewsletterSubscription = (newsletterId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    (params: Omit<SelfUpdateNewsletterSubscriptionParams, "newsletterId">) =>
      SelfUpdateNewsletterSubscription({ newsletterId, ...params }),
    {
      onSuccess: (_response: ConnectedXMResponse<any>) => {
        queryClient.invalidateQueries([SELF_NEWSLETTER_SUBSCRIPTIONS]);
      },
    },
  );
};

export default useSelfUpdateNewsletterSubscription;
