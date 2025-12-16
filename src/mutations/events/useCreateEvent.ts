import { ConnectedXMResponse, EventEvent } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  GROUP_EVENTS_QUERY_KEY,
  EVENT_LISTING_QUERY_KEY,
  EVENT_LISTINGS_QUERY_KEY,
  EVENTS_QUERY_KEY,
} from "@src/queries";
import { GetBaseSingleQueryKeys } from "@src/queries/useConnectedSingleQuery";
import { GetClientAPI } from "@src/ClientAPI";
import { EventCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventParams extends MutationParams {
  event: EventCreateInputs;
  imageDataUri?: any;
  groupId?: string;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEvent = async ({
  event,
  imageDataUri,
  groupId,
  clientApiParams,
  queryClient,
}: CreateEventParams): Promise<ConnectedXMResponse<EventEvent>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventEvent>>(
    `/listings`,
    {
      event,
      image: imageDataUri ? imageDataUri : undefined,
      groupId: groupId || undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTINGS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTINGS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: EVENTS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: EVENTS_QUERY_KEY(true),
    });
    if (groupId) {
      queryClient.invalidateQueries({
        queryKey: GROUP_EVENTS_QUERY_KEY(groupId),
      });
    }
    queryClient.setQueryData(
      [
        ...EVENT_LISTING_QUERY_KEY(data.data.id),
        ...GetBaseSingleQueryKeys(clientApiParams.locale),
      ],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useCreateEvent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEvent>>,
      Omit<CreateEventParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventParams,
    Awaited<ReturnType<typeof CreateEvent>>
  >(CreateEvent, options);
};
