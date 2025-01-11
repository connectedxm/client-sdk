import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { Lead, ConnectedXMResponse } from "@src/interfaces";
import {
  GetBaseSingleQueryKeys,
  SELF_LEAD_COUNTS_QUERY_KEY,
  SELF_LEAD_QUERY_KEY,
  SELF_LEADS_QUERY_KEY,
} from "@src/queries";

export interface UpdateSelfLeadParams extends MutationParams {
  leadId: string;
  lead: {
    status?: "new" | "favorited" | "archived" | "deleted";
    note?: string;
  };
}

export const UpdateSelfLead = async ({
  leadId,
  lead,
  queryClient,
  clientApiParams,
}: UpdateSelfLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Lead>>(
    `/self/leads/${leadId}`,
    lead
  );

  if (queryClient && data.status === "ok") {
    if (lead.status) {
      queryClient.invalidateQueries({ queryKey: SELF_LEADS_QUERY_KEY() });
      queryClient.invalidateQueries({ queryKey: SELF_LEAD_COUNTS_QUERY_KEY() });
    }

    queryClient.setQueryData(
      [
        ...SELF_LEAD_QUERY_KEY(leadId),
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
      ],
      data
    );
  }

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
