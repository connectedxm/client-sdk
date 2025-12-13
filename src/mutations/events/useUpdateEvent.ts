import { ConnectedXMResponse, EventListing } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  SET_LISTING_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ListingUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventParams extends MutationParams {
  eventId: string;
  event: ListingUpdateInputs;
  base64?: any;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEvent = async ({
  eventId,
  event,
  base64,
  clientApiParams,
  queryClient,
}: UpdateEventParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<EventListing>>(
    `/listings/${eventId}`,
    {
      event,
      image: base64 ?? undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_LISTING_QUERY_DATA(queryClient, [eventId], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY() });
    queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY(eventId) });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEvent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEvent>>,
      Omit<UpdateEventParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventParams,
    Awaited<ConnectedXMResponse<EventListing>>
  >(UpdateEvent, options);
};
