import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Lead, ConnectedXMResponse } from "@src/interfaces";
import {
  GetBaseSingleQueryKeys,
  LEAD_COUNTS_QUERY_KEY,
  LEAD_QUERY_KEY,
  LEADS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Leads
 */
export interface UpdateLeadParams extends MutationParams {
  leadId: string;
  lead: {
    status?: "new" | "favorited" | "archived" | "deleted";
    note?: string;
  };
}

/**
 * @category Methods
 * @group Leads
 */
export const UpdateLead = async ({
  leadId,
  lead,
  queryClient,
  clientApiParams,
}: UpdateLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Lead>>(
    `/self/leads/${leadId}`,
    lead
  );

  if (queryClient && data.status === "ok") {
    if (lead.status) {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY() });
      queryClient.invalidateQueries({ queryKey: LEAD_COUNTS_QUERY_KEY() });
    }

    queryClient.setQueryData(
      [
        ...LEAD_QUERY_KEY(leadId),
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
      ],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Leads
 */
export const useUpdateLead = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateLead>>,
      Omit<UpdateLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateLeadParams,
    Awaited<ReturnType<typeof UpdateLead>>
  >(UpdateLead, options);
};
