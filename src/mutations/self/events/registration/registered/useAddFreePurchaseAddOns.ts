import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, Purchase } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

export interface AddFreePurchaseAddOnsParams extends MutationParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  addOnIds: string[];
}

export const AddFreePurchaseAddOns = async ({
  eventId,
  registrationId,
  purchaseId,
  addOnIds,
  clientApiParams,
  queryClient,
}: AddFreePurchaseAddOnsParams): Promise<ConnectedXMResponse<Purchase>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Purchase>>(
    `/self/events/${eventId}/registration/${registrationId}/purchases/${purchaseId}/addOns/free`,
    {
      addOnIds,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      predicate: ({ queryKey }) => {
        if (
          (queryKey[0] === "SELF" && queryKey[1] === "EVENT_REGISTRATION") ||
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

export const useAddFreePurchaseAddOns = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddFreePurchaseAddOns>>,
      Omit<AddFreePurchaseAddOnsParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddFreePurchaseAddOnsParams,
    Awaited<ReturnType<typeof AddFreePurchaseAddOns>>
  >(AddFreePurchaseAddOns, options);
};
