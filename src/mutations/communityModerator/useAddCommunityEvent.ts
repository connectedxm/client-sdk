import { ConnectedXMResponse, Event } from "@src/interfaces";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  COMMUNITY_EVENTS_QUERY_KEY,
  SELF_EVENT_LISTINGS_QUERY_KEY,
} from "@src/queries";

export interface AddCommunityEventParams extends MutationParams {
  communityId: string;
  eventId: string;
}

export const AddCommunityEvent = async ({
  communityId,
  eventId,
  clientApi,
  queryClient,
}: AddCommunityEventParams): Promise<ConnectedXMResponse<Event>> => {
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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddCommunityEvent>>,
      Omit<AddCommunityEventParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddCommunityEventParams,
    Awaited<ReturnType<typeof AddCommunityEvent>>
  >(AddCommunityEvent, params, options);
};
