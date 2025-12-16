import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  EVENT_LISTING_QUERY_KEY,
  EVENT_LISTINGS_QUERY_KEY,
  GROUP_EVENTS_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventParams extends MutationParams {
  eventId: string;
  groupId?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEvent = async ({
  eventId,
  groupId,
  clientApiParams,
  queryClient,
}: DeleteEventParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/listings/${eventId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENTS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTINGS_QUERY_KEY(false),
    });
    if (groupId) {
      queryClient.invalidateQueries({
        queryKey: GROUP_EVENTS_QUERY_KEY(groupId),
      });
    }
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEvent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEvent>>,
      Omit<DeleteEventParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventParams,
    Awaited<ReturnType<typeof DeleteEvent>>
  >(DeleteEvent, options);
};
