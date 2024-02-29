import { GetClientAPI } from "@src/ClientAPI";
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
  clientApiParams,
}: UpdateSelfLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);
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
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSelfLead>>,
      Omit<UpdateSelfLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfLeadParams,
    Awaited<ReturnType<typeof UpdateSelfLead>>
  >(UpdateSelfLead, options);
};
