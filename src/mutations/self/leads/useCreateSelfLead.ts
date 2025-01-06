import { ConnectedXMResponse, Lead } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SELF_LEAD_QUERY_KEY } from "@src/queries";

export interface CreateSelfLeadParams extends MutationParams {
  passId: string;
}

export const CreateSelfLead = async ({
  passId,
  clientApiParams,
  queryClient,
}: CreateSelfLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Lead>>(
    `/self/leads/${passId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(SELF_LEAD_QUERY_KEY(data.data.id), data.data);
  }

  return data;
};

export const useCreateSelfLead = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateSelfLead>>,
      Omit<CreateSelfLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateSelfLeadParams,
    Awaited<ReturnType<typeof CreateSelfLead>>
  >(CreateSelfLead, options);
};
