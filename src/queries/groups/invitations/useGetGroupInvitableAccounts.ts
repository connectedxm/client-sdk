import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "../useGetGroup";
import { ConnectedXMResponse, InvitableAccount } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_INVITABLE_ACCOUNTS_QUERY_KEY = (
  groupId: string
): QueryKey => [...GROUP_QUERY_KEY(groupId), "INVITABLE_ACCOUNTS"];

export interface GetGroupInvitableAccountsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupInvitableAccounts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
  clientApiParams,
}: GetGroupInvitableAccountsProps): Promise<
  ConnectedXMResponse<InvitableAccount[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/groups/${groupId}/invitations/accounts`,
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

export const useGetGroupInvitableAccounts = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupInvitableAccounts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupInvitableAccounts>>
  >(
    GROUP_INVITABLE_ACCOUNTS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) =>
      GetGroupInvitableAccounts({ groupId, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
