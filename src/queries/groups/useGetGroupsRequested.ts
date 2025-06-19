import type { Group } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";
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
  const { data } = await clientApi.get(`/self/groups/requests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

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
