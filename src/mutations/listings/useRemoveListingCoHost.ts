import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_CO_HOSTS_QUERY_KEY } from "@src/queries/listings/useGetListingCoHosts";

export interface RemoveListingCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

export const RemoveListingCoHost = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveListingCoHostParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/coHosts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_CO_HOSTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useRemoveListingCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveListingCoHost>>,
      Omit<RemoveListingCoHostParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveListingCoHostParams,
    Awaited<ReturnType<typeof RemoveListingCoHost>>
  >(RemoveListingCoHost, options);
};
