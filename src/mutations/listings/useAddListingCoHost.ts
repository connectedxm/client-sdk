import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_CO_HOSTS_QUERY_KEY } from "@src/queries/listings/useGetListingCoHosts";

export interface AddListingCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const AddListingCoHost = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: AddListingCoHostParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/coHosts`,
    {
      accountId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_CO_HOSTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useAddListingCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddListingCoHost>>,
      Omit<AddListingCoHostParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddListingCoHostParams,
    Awaited<ReturnType<typeof AddListingCoHost>>
  >(AddListingCoHost, options);
};
