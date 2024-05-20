import { isUUID, useGetSelfRelationships } from "..";

export const useIsGroupMember = (
  groupId?: string,
  role?: "moderator" | "member"
) => {
  const { data: relationships } = useGetSelfRelationships();

  if (!groupId) return false;
  if (!isUUID(groupId)) {
    throw new Error("Invalid groupId. Did you pass in the slug?");
  }

  const _role = relationships?.data.groups[groupId];

  if (role) {
    return _role === role;
  } else {
    return _role === "member" || _role === "moderator";
  }
};

export default useIsGroupMember;
