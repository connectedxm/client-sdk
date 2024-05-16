import {
  ConnectedXMResponse,
  GetBaseSingleQueryKeys,
  SELF_RELATIONSHIPS_QUERY_KEY,
  SelfRelationships,
  useConnectedXM,
} from "..";

export const useIsCommunityMember = (communityId: string) => {
  const { queryClient, locale } = useConnectedXM();

  const relationships = queryClient.getQueryData<
    ConnectedXMResponse<SelfRelationships>
  >([...SELF_RELATIONSHIPS_QUERY_KEY(), GetBaseSingleQueryKeys(locale)]);

  return relationships?.data.communities[communityId] || false;
};

export default useIsCommunityMember;
