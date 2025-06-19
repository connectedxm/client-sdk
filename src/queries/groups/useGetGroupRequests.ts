import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { GroupRequest, GroupRequestStatus } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_REQUEST_QUERY_KEY } from "./useGetGroupRequest";

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

export const SET_GROUP_REQUESTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_REQUESTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupRequests>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUP_REQUESTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
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
  queryClient,
  clientApiParams,
  locale,
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
  });return data;
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
