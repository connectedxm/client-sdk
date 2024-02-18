import { ConnectedXMResponse, Lead } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";

export interface CreateEventLeadParams extends MutationParams {
  eventId: string;
  purchaseId: string;
  note?: string;
}

export const CreateEventLead = async ({
  eventId,
  purchaseId,
  note,
  clientApi,
  queryClient,
}: CreateEventLeadParams): Promise<ConnectedXMResponse<Lead>> => {
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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventLead>>,
      Omit<CreateEventLeadParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventLeadParams,
    Awaited<ReturnType<typeof CreateEventLead>>
  >(CreateEventLead, params, options);
};
