import { isUUID, useGetSelfRelationships } from "..";

export const useIsCommunityMember = (
  communityId?: string,
  role?: "moderator" | "member"
) => {
  const { data: relationships } = useGetSelfRelationships();

  if (!communityId) return false;
  if (!isUUID(communityId)) {
    throw new Error("Invalid communityId. Did you pass in the slug?");
  }

  const _role = relationships?.data.communities[communityId];

  if (role) {
    return _role === role;
  } else {
    return _role === "member" || _role === "moderator";
  }
};

export default useIsCommunityMember;
