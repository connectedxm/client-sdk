import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, ListingPass } from "@src/interfaces";
import {
  LISTING_ATTENDEE_QUERY_KEY,
  LISTING_ATTENDEES_QUERY_KEY,
  LISTING_PASS_QUERY_KEY,
  LISTING_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface UndoCheckinEventAttendeePassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const UndoCheckinEventAttendeePass = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
  queryClient,
}: UndoCheckinEventAttendeePassParams): Promise<
  ConnectedXMResponse<ListingPass>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<ListingPass>>(
    `/listings/${eventId}/attendees/${accountId}/passes/${passId}/checkin`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_ATTENDEES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_ATTENDEE_QUERY_KEY(eventId, accountId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_PASSES_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTING_PASS_QUERY_KEY(eventId, passId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUndoCheckinEventAttendeePass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UndoCheckinEventAttendeePass>>,
      Omit<
        UndoCheckinEventAttendeePassParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UndoCheckinEventAttendeePassParams,
    Awaited<ReturnType<typeof UndoCheckinEventAttendeePass>>
  >(UndoCheckinEventAttendeePass, options);
};
