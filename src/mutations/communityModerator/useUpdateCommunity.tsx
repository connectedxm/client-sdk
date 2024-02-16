import { ConnectedXM, ConnectedXMResponse } from "@context/api/ConnectedXM";
import { Account } from "@context/interfaces";
import { QUERY_KEY as COMMUNITIES } from "@context/queries/communities/useGetCommunities";
import { QUERY_KEY as COMMUNITY } from "@context/queries/communities/useGetCommunity";
import { QUERY_KEY as SELF_COMMUNITIES } from "@context/queries/self/useGetSelfCommunityMemberships";
import { useQueryClient } from "@tanstack/react-query";

import useConnectedMutation, { MutationParams } from "../useConnectedMutation";

interface UpdateCommunityParams extends MutationParams {
  communityId: string;
  description?: string;
  externalUrl?: string;
  base64?: string;
}

export const UpdateCommunity = async ({
  communityId,
  description,
  externalUrl,
  base64,
}: UpdateCommunityParams) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(`/communityModerator/${communityId}`, {
    description: description || undefined,
    externalUrl: externalUrl || undefined,
    buffer: base64 ? `data:image/jpeg;base64,${base64}` : undefined,
  });
  return data;
};

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<UpdateCommunityParams>(UpdateCommunity, {
    onSuccess: (response: ConnectedXMResponse<Account>) => {
      // Update for single cached community
      queryClient.setQueryData([COMMUNITY, response.data.username], response);

      // Update for cached self community relationships
      queryClient.setQueryData([SELF_COMMUNITIES], (data: any) => {
        if (!data?.pages || data?.pages?.length === 0) return data;
        let pageIndex;
        let communityIndex;
        for (let x = 0; x < data.pages.length; x++) {
          for (let y = 0; y < data.pages[x].data.length; y++) {
            if (data.pages[x].data[y].community.id === response.data.id) {
              pageIndex = x;
              communityIndex = y;
            }
          }
        }
        if (
          typeof pageIndex != "undefined" &&
          typeof communityIndex != "undefined"
        ) {
          data.pages[pageIndex].data[communityIndex].community = response.data;
        }
        return data;
      });

      // Update for cached communities
      queryClient.setQueryData([COMMUNITIES], (data: any) => {
        if (!data?.pages || data?.pages?.length === 0) return data;
        let pageIndex;
        let communityIndex;
        for (let x = 0; x < data.pages.length; x++) {
          for (let y = 0; y < data.pages[x].data.length; y++) {
            if (data.pages[x].data[y].id === response.data.id) {
              pageIndex = x;
              communityIndex = y;
            }
          }
        }
        if (
          typeof pageIndex != "undefined" &&
          typeof communityIndex != "undefined"
        ) {
          data.pages[pageIndex].data[communityIndex] = response.data;
        }
        return data;
      });
    },
  });
};

export default useUpdateCommunity;
