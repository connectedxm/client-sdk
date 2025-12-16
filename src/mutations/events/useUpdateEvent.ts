import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  SET_EVENT_QUERY_DATA,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { EventUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventParams extends MutationParams {
  eventId: string;
  event: EventUpdateInputs;
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
}: UpdateEventParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.put<ConnectedXMResponse<EventEvent>>(
    `/listings/${eventId}`,
    {
      event,
      image: base64 ?? undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_QUERY_DATA(queryClient, [eventId], data, [
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
    Awaited<ConnectedXMResponse<EventEvent>>
  >(UpdateEvent, options);
};
