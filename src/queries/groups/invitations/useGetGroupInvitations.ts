import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { GroupInvitation, GroupInvitationStatus } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "../useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_INVITATIONS_QUERY_KEY = (
  groupId: string,
  status?: keyof typeof GroupInvitationStatus
): QueryKey => {
  const keys = [...GROUP_QUERY_KEY(groupId), "INVITATIONS"];

  if (status) {
    keys.push(status);
  }

  return keys;
};

export const SET_GROUP_INVITATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_INVITATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupInvitations>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUP_INVITATIONS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetGroupInvitationsProps extends InfiniteQueryParams {
  groupId: string;
  status?: keyof typeof GroupInvitationStatus;
}

export const GetGroupInvitations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  groupId,
  clientApiParams,
}: GetGroupInvitationsProps): Promise<
  ConnectedXMResponse<GroupInvitation[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/invitations`, {
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

export const useGetGroupInvitations = (
  groupId: string = "",
  status?: keyof typeof GroupInvitationStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupInvitations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupInvitations>>
  >(
    GROUP_INVITATIONS_QUERY_KEY(groupId, status),
    (params: InfiniteQueryParams) =>
      GetGroupInvitations({ groupId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
