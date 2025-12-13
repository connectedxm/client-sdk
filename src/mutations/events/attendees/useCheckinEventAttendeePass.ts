import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
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
export interface CheckinEventAttendeePassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CheckinEventAttendeePass = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
  queryClient,
}: CheckinEventAttendeePassParams): Promise<ConnectedXMResponse<Pass>> => {
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

/**
 * @category Mutations
 * @group Events
 */
export const useCheckinEventAttendeePass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CheckinEventAttendeePass>>,
      Omit<CheckinEventAttendeePassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinEventAttendeePassParams,
    Awaited<ReturnType<typeof CheckinEventAttendeePass>>
  >(CheckinEventAttendeePass, options);
};
