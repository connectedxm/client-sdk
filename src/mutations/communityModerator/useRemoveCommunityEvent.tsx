import {
  COMMUNITY_EVENTS_QUERY_KEY,
  SELF_EVENT_LISTINGS_QUERY_KEY,
} from "@src/queries";
import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

interface RemoveCommunityEventParams extends MutationParams {
  communityId: string;
  eventId: string;
}

export const RemoveCommunityEvent = async ({
  communityId,
  eventId,
  clientApi,
  queryClient,
}: RemoveCommunityEventParams): Promise<ConnectedXMResponse<null>> => {
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/communityModerator/${communityId}/events/${eventId}`
  );

  if (queryClient && data.status === "ok") {
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

export const useRemoveCommunityEvent = (
  options: MutationOptions<
    Awaited<ReturnType<typeof RemoveCommunityEvent>>,
    RemoveCommunityEventParams
  >
) => {
  return useConnectedMutation<
    RemoveCommunityEventParams,
    Awaited<ReturnType<typeof RemoveCommunityEvent>>
  >(RemoveCommunityEvent, options);
};

export default useRemoveCommunityEvent;
