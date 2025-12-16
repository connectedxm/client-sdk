import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORS_QUERY_KEY, SET_EVENT_LISTING_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface AddEventListingSponsorParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventListingSponsor = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: AddEventListingSponsorParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/sponsors`,
    {
      sponsorId: accountId,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORS_QUERY_KEY(eventId),
    });
    SET_EVENT_LISTING_QUERY_DATA(queryClient, [eventId], data);
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useAddEventListingSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddEventListingSponsor>>,
      Omit<AddEventListingSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventListingSponsorParams,
    Awaited<ReturnType<typeof AddEventListingSponsor>>
  >(AddEventListingSponsor, options);
};
