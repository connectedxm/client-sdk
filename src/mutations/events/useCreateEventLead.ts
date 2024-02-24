import { ConnectedXMResponse, Lead } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface CreateEventLeadParams extends MutationParams {
  eventId: string;
  purchaseId: string;
  note?: string;
}

export const CreateEventLead = async ({
  eventId,
  purchaseId,
  note,
  clientApiParams,
  queryClient,
}: CreateEventLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post(
    `/events/${eventId}/leads/${purchaseId}`,
    {
      note: note || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    // TODO: QUERIES NEED TO BE ADDED
    // queryClient.setQueryData([LEAD, response.data.id], response);
  }

  return data;
};

export const useCreateEventLead = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventLead>>,
      Omit<CreateEventLeadParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventLeadParams,
    Awaited<ReturnType<typeof CreateEventLead>>
  >(CreateEventLead, params, options);
};
