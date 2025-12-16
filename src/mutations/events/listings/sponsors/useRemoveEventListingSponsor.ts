import { EVENT_SPONSORS_QUERY_KEY, SET_EVENT_LISTING_QUERY_DATA } from "@src/queries";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface RemoveEventListingSponsorParams extends MutationParams {
  eventId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventListingSponsor = async ({
  eventId,
  accountId,
  clientApiParams,
  queryClient,
}: RemoveEventListingSponsorParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}/sponsors/${accountId}`
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
export const useRemoveEventListingSponsor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventListingSponsor>>,
      Omit<RemoveEventListingSponsorParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventListingSponsorParams,
    Awaited<ReturnType<typeof RemoveEventListingSponsor>>
  >(RemoveEventListingSponsor, options);
};
