import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, EventPass } from "@src/interfaces";
import {
  EVENT_LISTING_ATTENDEES_QUERY_KEY,
  EVENT_LISTING_PASS_QUERY_KEY,
  EVENT_LISTING_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UndoCheckinEventListingPassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UndoCheckinEventListingPass = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
  queryClient,
}: UndoCheckinEventListingPassParams): Promise<
  ConnectedXMResponse<EventPass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<EventPass>>(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}/checkin`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_ATTENDEES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_PASSES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_PASS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUndoCheckinEventListingPass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UndoCheckinEventListingPass>>,
      Omit<UndoCheckinEventListingPassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UndoCheckinEventListingPassParams,
    Awaited<ReturnType<typeof UndoCheckinEventListingPass>>
  >(UndoCheckinEventListingPass, options);
};
