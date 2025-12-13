import { Account, ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORS_QUERY_KEY, SET_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface AddEventSponsorParams extends MutationParams {
  eventId: string;
  sponsor: Account;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventSponsor = async ({
  eventId,
  sponsor,
  clientApiParams,
  queryClient,
}: AddEventSponsorParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}/sponsors`,
    {
      sponsorId: sponsor.id,
    }
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
export const useAddEventSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddEventSponsor>>,
      Omit<AddEventSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSponsorParams,
    Awaited<ReturnType<typeof AddEventSponsor>>
  >(AddEventSponsor, options);
};
