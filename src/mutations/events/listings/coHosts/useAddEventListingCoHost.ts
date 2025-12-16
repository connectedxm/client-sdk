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
export interface AddEventListingCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventListingCoHost = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: AddEventListingCoHostParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/coHosts`,
    {
      accountId,
    }
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
export const useAddEventListingCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddEventListingCoHost>>,
      Omit<AddEventListingCoHostParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventListingCoHostParams,
    Awaited<ReturnType<typeof AddEventListingCoHost>>
  >(AddEventListingCoHost, options);
};
