import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { QUERY_KEY as SELF_NEWSLETTER_SUBSCRIPTIONS } from "@context/queries/self/useGetSelfNewsletterSubscriptions";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

export interface SelfJoinNewsletterParams extends MutationParams {}

export const SelfJoinNewsletter = async (_: SelfJoinNewsletterParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/self/newsletters`);
  return data;
};

export const useSelfJoinNewsletter = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    (params: Omit<SelfJoinNewsletterParams, "newsletterId">) =>
      SelfJoinNewsletter({ ...params }),
    {
      onSuccess: (_response: ConnectedXMResponse<any>) => {
        queryClient.invalidateQueries([SELF_NEWSLETTER_SUBSCRIPTIONS]);
      },
    }
  );
};

export default useSelfJoinNewsletter;
