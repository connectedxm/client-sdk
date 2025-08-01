import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import { GroupMembership, ConnectedXMResponse } from "@interfaces";
import { SELF_GROUP_MEMBERSHIPS_QUERY_KEY } from "./useGetSelfGroupMemberships";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_GROUP_MEMBERSHIP_QUERY_KEY = (groupId: string): QueryKey => [
  ...SELF_GROUP_MEMBERSHIPS_QUERY_KEY(),
  groupId,
];

export const SET_SELF_GROUP_MEMBERSHIP_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_GROUP_MEMBERSHIP_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelfGroupMembership>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SELF_GROUP_MEMBERSHIP_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSelfGroupMembershipProps extends SingleQueryParams {
  groupId: string;
}

export const GetSelfGroupMembership = async ({
  groupId,
  clientApiParams,
}: GetSelfGroupMembershipProps): Promise<
  ConnectedXMResponse<GroupMembership>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/groups/${groupId}/membership`);
  return data;
};

export const useGetSelfGroupMembership = (
  groupId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSelfGroupMembership>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSelfGroupMembership>>(
    SELF_GROUP_MEMBERSHIP_QUERY_KEY(groupId),
    (params: SingleQueryParams) =>
      GetSelfGroupMembership({ groupId, ...params }),
    {
      ...options,
      enabled: !!authenticated && !!groupId && (options?.enabled ?? true),
    }
  );
};
