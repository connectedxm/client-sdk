import { useGetSelfRelationships } from "..";

export const useIsCommunityMember = (communityId: string) => {
  const { data: relationships } = useGetSelfRelationships();
  return relationships?.data.communities[communityId] || false;
};

export default useIsCommunityMember;
