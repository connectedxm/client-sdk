import { ClientAPI } from "@src/ClientAPI";
import { Announcement } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { COMMUNITY_QUERY_KEY } from "./useGetCommunity";
import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";

export const COMMUNITY_ANNOUNCEMENTS_QUERY_KEY = (communityId: string) => [
  ...COMMUNITY_QUERY_KEY(communityId),
  "ANNOUNCEMENTS",
];

export const SET_COMMUNITY_ANNOUNCEMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof COMMUNITY_ANNOUNCEMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCommunityAnnouncements>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...COMMUNITY_ANNOUNCEMENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetCommunityAnnouncementsProps extends InfiniteQueryParams {
  communityId: string;
}

export const GetCommunityAnnouncements = async ({
  communityId,
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetCommunityAnnouncementsProps): Promise<
  ConnectedXMResponse<Announcement[]>
> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(
    `/communities/${communityId}/announcements`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

const useGetCommunityAnnouncements = (communityId: string) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCommunityAnnouncements>>
  >(
    COMMUNITY_ANNOUNCEMENTS_QUERY_KEY(communityId),
    (params: InfiniteQueryParams) =>
      GetCommunityAnnouncements({ communityId, ...params }),
    {
      enabled: !!token && !!communityId,
    }
  );
};

export default useGetCommunityAnnouncements;
