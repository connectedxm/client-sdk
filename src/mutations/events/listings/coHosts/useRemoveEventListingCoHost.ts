import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_CO_HOSTS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventListingCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventListingCoHost = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveEventListingCoHostParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/coHosts/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_CO_HOSTS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useRemoveEventListingCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventListingCoHost>>,
      Omit<RemoveEventListingCoHostParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventListingCoHostParams,
    Awaited<ReturnType<typeof RemoveEventListingCoHost>>
  >(RemoveEventListingCoHost, options);
};
