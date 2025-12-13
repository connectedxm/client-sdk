import {
  ConnectedXMResponse,
  EventListing,
  Session,
  Speaker,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import {
  GROUP_EVENTS_QUERY_KEY,
  EVENT_QUERY_KEY,
  LISTINGS_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { ListingCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventParams extends MutationParams {
  event: ListingCreateInputs;
  imageDataUri?: any;
  groupId?: string;
  sponsorIds?: string[];
  speakers?: Speaker[];
  sessions?: Session[];
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEvent = async ({
  event,
  imageDataUri,
  groupId,
  sponsorIds,
  speakers,
  sessions,
  clientApiParams,
  queryClient,
}: CreateEventParams): Promise<ConnectedXMResponse<EventListing>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<EventListing>>(
    `/listings`,
    {
      event,
      image: imageDataUri ? imageDataUri : undefined,
      groupId: groupId || undefined,
      sponsorIds: sponsorIds || undefined,
      speakers,
      sessions,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(false),
    });
    queryClient.invalidateQueries({
      queryKey: LISTINGS_QUERY_KEY(true),
    });
    if (groupId) {
      queryClient.invalidateQueries({
        queryKey: GROUP_EVENTS_QUERY_KEY(groupId),
      });
    }
    queryClient.setQueryData(
      [...EVENT_QUERY_KEY(data.data.id), clientApiParams.locale],
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
