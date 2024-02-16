import { ConnectedXM } from "@context/api/ConnectedXM";
import { QUERY_KEY as COMMUNITY_EVENTS } from "@context/queries/communities/useGetCommunityEvents";
import { QUERY_KEY as SELF_LISTINGS } from "@context/queries/self/useGetSelfEventListings";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface AddCommunityEventParams extends MutationParams {
  communityId: string;
  eventId: string;
}

export const AddCommunityEvent = async ({
  communityId,
  eventId,
}: AddCommunityEventParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/communityModerator/${communityId}/events/${eventId}`,
  );
  return data;
};

export const useAddCommunityEvent = (communityId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<Omit<AddCommunityEventParams, "communityId">>(
    (params: Omit<AddCommunityEventParams, "communityId">) =>
      AddCommunityEvent({ ...params, communityId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COMMUNITY_EVENTS, communityId]);
        queryClient.invalidateQueries([SELF_LISTINGS]);
      },
    },
  );
};

export default useAddCommunityEvent;
