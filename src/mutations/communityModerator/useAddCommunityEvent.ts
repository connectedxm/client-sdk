import { ConnectedXMResponse, Event } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  COMMUNITY_EVENTS_QUERY_KEY,
  SELF_EVENT_LISTINGS_QUERY_KEY,
} from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

export interface AddCommunityEventParams extends MutationParams {
  communityId: string;
  eventId: string;
}

export const AddCommunityEvent = async ({
  communityId,
  eventId,
  clientApiParams,
  queryClient,
}: AddCommunityEventParams): Promise<ConnectedXMResponse<Event>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Event>>(
    `/communityModerator/${communityId}/events/${eventId}`
  );

  if (queryClient) {
    queryClient.invalidateQueries({
      queryKey: COMMUNITY_EVENTS_QUERY_KEY(communityId),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(true),
    });
    queryClient.invalidateQueries({
      queryKey: SELF_EVENT_LISTINGS_QUERY_KEY(false),
    });
  }

  return data;
};

export const useAddCommunityEvent = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddCommunityEvent>>,
      Omit<AddCommunityEventParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddCommunityEventParams,
    Awaited<ReturnType<typeof AddCommunityEvent>>
  >(AddCommunityEvent, options);
};
