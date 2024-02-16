import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Lead } from "@context/interfaces";
import { QUERY_KEY as LEAD } from "@context/queries/self/useGetSelfLead";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface CreateEventLeadParams extends MutationParams {
  eventId: string;
  purchaseId: string;
  note?: string;
}

export const CreateEventLead = async ({
  eventId,
  purchaseId,
  note,
}: CreateEventLeadParams) => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/leads/${purchaseId}`,
    {
      note: note || undefined,
    }
  );
  return data;
};

export const useCreateEventLead = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Omit<CreateEventLeadParams, "eventId">>(
    (params: Omit<CreateEventLeadParams, "eventId">) =>
      CreateEventLead({ ...params, eventId }),
    {
      onSuccess: (response: ConnectedXMResponse<Lead>) => {
        if (response?.data)
          queryClient.setQueryData([LEAD, response.data.id], response);
      },
    },
    undefined,
    true
  );
};

export default useCreateEventLead;
