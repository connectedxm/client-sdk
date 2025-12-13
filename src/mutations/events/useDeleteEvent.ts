import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  LISTINGS_QUERY_KEY,
  LISTING_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventParams extends MutationParams {
  eventId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEvent = async ({
  eventId,
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
    queryClient.removeQueries({
      queryKey: EVENT_QUERY_KEY(eventId),
    });
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(false),
    });
    queryClient.removeQueries({
      queryKey: LISTING_QUERY_KEY(eventId),
    });
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
