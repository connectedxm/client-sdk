import type { Group } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUPS_QUERY_KEY } from "./useGetGroups";

export const GROUPS_FEATURED_QUERY_KEY = (): QueryKey => {
  return [...GROUPS_QUERY_KEY(), "FEATURED"];
};

export interface GetGroupsFeaturedProps extends InfiniteQueryParams {}

export const GetGroupsFeatured = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetGroupsFeaturedProps): Promise<ConnectedXMResponse<Group[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/featured`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetGroupsFeatured = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupsFeatured>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupsFeatured>>
  >(
    GROUPS_FEATURED_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetGroupsFeatured({ ...params }),
    params,
    options
  );
};
