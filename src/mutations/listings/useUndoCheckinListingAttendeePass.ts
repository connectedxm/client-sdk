import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ListingPass } from "@src/interfaces";
import {
  LISTING_ATTENDEE_QUERY_KEY,
  LISTING_ATTENDEES_QUERY_KEY,
  LISTING_PASS_QUERY_KEY,
  LISTING_PASSES_QUERY_KEY,
} from "@src/queries";

export interface UndoCheckinListingAttendeePassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

export const UndoCheckinListingAttendeePass = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
  queryClient,
}: UndoCheckinListingAttendeePassParams): Promise<
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

export const useUndoCheckinListingAttendeePass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UndoCheckinListingAttendeePass>>,
      Omit<
        UndoCheckinListingAttendeePassParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UndoCheckinListingAttendeePassParams,
    Awaited<ReturnType<typeof UndoCheckinListingAttendeePass>>
  >(UndoCheckinListingAttendeePass, options);
};
