import { Announcement } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_ANNOUNCEMENTS_QUERY_KEY = (groupId: string): QueryKey => [
  ...GROUP_QUERY_KEY(groupId),
  "ANNOUNCEMENTS",
];

export interface GetGroupAnnouncementsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupAnnouncements = async ({
  groupId,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetGroupAnnouncementsProps): Promise<
  ConnectedXMResponse<Announcement[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/announcements`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupAnnouncements = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupAnnouncements>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupAnnouncements>>
  >(
    GROUP_ANNOUNCEMENTS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) =>
      GetGroupAnnouncements({ groupId, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
