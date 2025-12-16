import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Pass } from "@src/interfaces";
import {
  EVENT_LISTING_ATTENDEES_QUERY_KEY,
  EVENT_LISTING_PASS_QUERY_KEY,
  EVENT_LISTING_PASSES_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface CheckinEventListingPassParams extends MutationParams {
  eventId: string;
  accountId: string;
  passId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CheckinEventListingPass = async ({
  eventId,
  accountId,
  passId,
  clientApiParams,
  queryClient,
}: CheckinEventListingPassParams): Promise<ConnectedXMResponse<Pass>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Pass>>(
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
export const useCheckinEventListingPass = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CheckinEventListingPass>>,
      Omit<CheckinEventListingPassParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CheckinEventListingPassParams,
    Awaited<ReturnType<typeof CheckinEventListingPass>>
  >(CheckinEventListingPass, options);
};
