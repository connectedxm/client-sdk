import type { Group } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUPS_QUERY_KEY } from "./useGetGroups";

export const GROUPS_INVITED_QUERY_KEY = (): QueryKey => {
  return [...GROUPS_QUERY_KEY(), "INVITED"];
};

export interface GetGroupsInvitedProps extends InfiniteQueryParams {}

export const GetGroupsInvited = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetGroupsInvitedProps): Promise<ConnectedXMResponse<Group[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/invited`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (groupId) => GROUP_QUERY_KEY(groupId),
      locale
    );
  }

  return data;
};

export const useGetGroupsInvited = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupsInvited>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupsInvited>>
  >(
    GROUPS_INVITED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetGroupsInvited({ ...params }),
    params,
    options
  );
};
