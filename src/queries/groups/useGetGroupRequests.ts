import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GroupRequest, GroupRequestStatus } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_REQUESTS_QUERY_KEY = (
  groupId: string,
  status?: keyof typeof GroupRequestStatus
): QueryKey => {
  const keys = [...GROUP_QUERY_KEY(groupId), "REQUESTS"];

  if (status) {
    keys.push(status);
  }

  return keys;
};

export interface GetGroupRequestsProps extends InfiniteQueryParams {
  groupId: string;
  status?: keyof typeof GroupRequestStatus;
}

export const GetGroupRequests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  groupId,
  clientApiParams,
}: GetGroupRequestsProps): Promise<ConnectedXMResponse<GroupRequest[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/requests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });

  return data;
};

export const useGetGroupRequests = (
  groupId: string = "",
  status?: keyof typeof GroupRequestStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupRequests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupRequests>>
  >(
    GROUP_REQUESTS_QUERY_KEY(groupId, status),
    (params: InfiniteQueryParams) =>
      GetGroupRequests({ groupId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
