import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as COMMUNITY_EVENTS } from "@context/queries/communities/useGetCommunityEvents";
import { QUERY_KEY as SELF_LISTINGS } from "@context/queries/self/useGetSelfEventListings";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface RemoveCommunityEventParams extends MutationParams {
  communityId: string;
  eventId: string;
}

export const RemoveCommunityEvent = async ({
  communityId,
  eventId,
}: RemoveCommunityEventParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/communityModerator/${communityId}/events/${eventId}`,
  );
  return data;
};

export const useRemoveCommunityEvent = (communityId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<RemoveCommunityEventParams>(
    RemoveCommunityEvent,
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMMUNITY_EVENTS, communityId]);
        queryClient.invalidateQueries([SELF_LISTINGS]);
      },
    },
  );
};

export default useRemoveCommunityEvent;
