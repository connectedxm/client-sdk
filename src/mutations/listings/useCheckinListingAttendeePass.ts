import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
import {
  LISTING_ATTENDEE_QUERY_KEY,
  LISTING_ATTENDEES_QUERY_KEY,
  LISTING_PASS_QUERY_KEY,
  LISTING_PASSES_QUERY_KEY,
} from "@src/queries";

export interface CheckinListingAttendeePassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

export const CheckinListingAttendeePass = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
  queryClient,
}: CheckinListingAttendeePassParams): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Pass>>(
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

export const useCheckinListingAttendeePass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CheckinListingAttendeePass>>,
      Omit<CheckinListingAttendeePassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinListingAttendeePassParams,
    Awaited<ReturnType<typeof CheckinListingAttendeePass>>
  >(CheckinListingAttendeePass, options);
};
