import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { SELF_LEADS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface DeleteSelfLeadParams extends MutationParams {
  leadId: string;
}

export const DeleteSelfLead = async ({
  leadId,
  clientApiParams,
  queryClient,
}: DeleteSelfLeadParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/self/leads/${leadId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SELF_LEADS_QUERY_KEY(),
    });
  }

  return data;
};

export const useDeleteSelfLead = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelfLead>>,
      Omit<DeleteSelfLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfLeadParams,
    Awaited<ReturnType<typeof DeleteSelfLead>>
  >(DeleteSelfLead, options);
};
