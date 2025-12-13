import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { LEADS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Leads
 */
export interface DeleteLeadParams extends MutationParams {
  leadId: string;
}

/**
 * @category Methods
 * @group Leads
 */
export const DeleteLead = async ({
  leadId,
  clientApiParams,
  queryClient,
}: DeleteLeadParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/leads/${leadId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LEADS_QUERY_KEY(),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Leads
 */
export const useDeleteLead = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteLead>>,
      Omit<DeleteLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteLeadParams,
    Awaited<ReturnType<typeof DeleteLead>>
  >(DeleteLead, options);
};
