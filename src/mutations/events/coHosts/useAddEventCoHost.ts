import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_CO_HOSTS_QUERY_KEY } from "@src/queries/listings/useGetListingCoHosts";

/**
 * @category Params
 * @group Events
 */
export interface AddEventCoHostParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventCoHost = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: AddEventCoHostParams): Promise<ConnectedXMResponse<EventListing>> => {
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

/**
 * @category Mutations
 * @group Events
 */
export const useAddEventCoHost = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddEventCoHost>>,
      Omit<AddEventCoHostParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventCoHostParams,
    Awaited<ReturnType<typeof AddEventCoHost>>
  >(AddEventCoHost, options);
};
