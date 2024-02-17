import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Lead } from "@src/interfaces";

export interface UpdateSelfLeadParams extends MutationParams {
  leadId: string;
  note: string;
}

export const UpdateSelfLead = async ({
  leadId,
  note,
  clientApi,
}: UpdateSelfLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const { data } = await clientApi.put<ConnectedXMResponse<Lead>>(
    `/self/leads/${leadId}`,
    {
      note,
    }
  );

  // TO DO: Update invalidate query - we don't have a getter yet so we don't have a query key
  // if(queryClient && data.status === "ok") {
  //   queryClient.invalidateQueries([LEAD_KEY, response?.data?.id]);
  // }

  return data;
};

export const useUpdateSelfLead = (
  options: MutationOptions<
    Awaited<ReturnType<typeof UpdateSelfLead>>,
    UpdateSelfLeadParams
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfLeadParams,
    Awaited<ReturnType<typeof UpdateSelfLead>>
  >((params) => UpdateSelfLead({ ...params }), options);
};
