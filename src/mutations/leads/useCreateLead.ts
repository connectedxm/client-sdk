import { ConnectedXMResponse, Lead } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LEAD_QUERY_KEY } from "@src/queries";
import { LeadCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Leads
 */
export interface CreateLeadParams extends MutationParams {
  passId: string;
}

/**
 * @category Methods
 * @group Leads
 */
export const CreateLead = async ({
  passId,
  clientApiParams,
  queryClient,
}: CreateLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Lead>>(
    `/self/leads/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(LEAD_QUERY_KEY(data.data.id), data.data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Leads
 */
export const useCreateLead = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateLead>>,
      Omit<CreateLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateLeadParams,
    Awaited<ReturnType<typeof CreateLead>>
  >(CreateLead, options);
};
