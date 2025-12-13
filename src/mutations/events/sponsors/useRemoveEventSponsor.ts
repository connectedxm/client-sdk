import { EVENT_SPONSORS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventSponsorParams extends MutationParams {
  eventId: string;
  sponsorId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventSponsor = async ({
  eventId,
  sponsorId,
  clientApiParams,
  queryClient,
}: RemoveEventSponsorParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sponsors/${sponsorId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useRemoveEventSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventSponsor>>,
      Omit<RemoveEventSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSponsorParams,
    Awaited<ReturnType<typeof RemoveEventSponsor>>
  >(RemoveEventSponsor, options);
};
