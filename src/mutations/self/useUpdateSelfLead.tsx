import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as LEAD_KEY } from "@context/queries/self/useGetSelfLead";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UpdateSelfLeadParams extends MutationParams {
  leadId: string;
  note: string;
}

export const UpdateSelfLead = async ({
  leadId,
  note,
}: UpdateSelfLeadParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/self/leads/${leadId}`, {
    note,
  });
  return data;
};

export const useUpdateSelfLead = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateSelfLeadParams>(UpdateSelfLead, {
    onSuccess: (response: ConnectedXMResponse<Account>) => {
      queryClient.invalidateQueries([LEAD_KEY, response?.data?.id]);
    },
  });
};

export default useUpdateSelfLead;
