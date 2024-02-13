import type { CommunityMembership, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { useConnectedXM } from "@src/hooks";

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
  clientApi,
}: GetSelfCommunityMembershipsProps): Promise<
  ConnectedXMResponse<CommunityMembership[]>
> => {
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

const useGetSelfCommunityMemberships = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<
    ReturnType<typeof GetSelfCommunityMemberships>
  > = {}
) => {
  const { token } = useConnectedXM();

  return useConnectedInfiniteQuery<
    ReturnType<typeof GetSelfCommunityMemberships>
  >(
    SELF_COMMUNITY_MEMBERSHIPS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfCommunityMemberships({ ...params }),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};

export default useGetSelfCommunityMemberships;
