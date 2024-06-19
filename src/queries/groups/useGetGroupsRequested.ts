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

export const GROUPS_REQUESTED_QUERY_KEY = (): QueryKey => {
  return [...GROUPS_QUERY_KEY(), "REQUESTED"];
};

export interface GetGroupsRequestedProps extends InfiniteQueryParams {}

export const GetGroupsRequested = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApiParams,
  locale,
}: GetGroupsRequestedProps): Promise<ConnectedXMResponse<Group[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/requested`, {
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

export const useGetGroupsRequested = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupsRequested>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupsRequested>>
  >(
    GROUPS_REQUESTED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetGroupsRequested({ ...params }),
    params,
    options
  );
};
