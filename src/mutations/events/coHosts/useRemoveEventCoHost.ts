import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_CO_HOSTS_QUERY_KEY } from "@src/queries/listings/useGetListingCoHosts";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventCoHost = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveEventCoHostParams): Promise<ConnectedXMResponse<EventListing>> => {
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

/**
 * @category Mutations
 * @group Events
 */
export const useRemoveEventCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventCoHost>>,
      Omit<RemoveEventCoHostParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventCoHostParams,
    Awaited<ReturnType<typeof RemoveEventCoHost>>
  >(RemoveEventCoHost, options);
};
