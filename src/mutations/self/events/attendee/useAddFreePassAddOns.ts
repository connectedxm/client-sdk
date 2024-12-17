import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface AddFreePassAddOnsParams extends MutationParams {
  eventId: string;
  passId: string;
  addOnIds: string[];
}

export const AddFreePassAddOns = async ({
  eventId,
  passId,
  addOnIds,
  clientApiParams,
  queryClient,
}: AddFreePassAddOnsParams): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Pass>>(
    `/self/events/${eventId}/registration/passes/${passId}/addOns/free`,
    {
      addOnIds,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        if (
          (queryKey[0] === "SELF" &&
            (queryKey[1] === "REGISTRATION" || queryKey[1] === "ATTENDEE")) ||
          (queryKey[0] === "SELF" &&
            queryKey[1] === "EVENT" &&
            queryKey[3] === "REGISTRATION")
        ) {
          return true;
        }
        return false;
      },
    });
  }

  return data;
};

export const useAddFreePassAddOns = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddFreePassAddOns>>,
      Omit<AddFreePassAddOnsParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddFreePassAddOnsParams,
    Awaited<ReturnType<typeof AddFreePassAddOns>>
  >(AddFreePassAddOns, options);
};
