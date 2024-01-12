import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { CommunityMembership } from "@interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";

export const SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY = () => [
  ...SELF_QUERY_KEY(),
  "COMMUNITY_MEMBERSHIPS",
];

interface GetSelfCommunityMembershipsProps extends InfiniteQueryParams {}

export const GetSelfCommunityMemberships = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetSelfCommunityMembershipsProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self/communities`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

const useGetSelfCommunityMemberships = () => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfCommunityMemberships>>
  >(
    SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfCommunityMemberships({ ...params }),
    {
      enabled: !!token,
    }
  );
};

export default useGetSelfCommunityMemberships;
