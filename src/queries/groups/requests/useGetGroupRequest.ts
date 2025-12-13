import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { GroupRequest } from "@interfaces";
import { QueryClient, SetDataOptions, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_REQUESTS_QUERY_KEY } from "./useGetGroupRequests";

export const GROUP_REQUEST_QUERY_KEY = (
  groupId: string,
  requestId: string
): QueryKey => [...GROUP_REQUESTS_QUERY_KEY(groupId), "REQUESTS", requestId];

export const SET_GROUP_REQUEST_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_REQUEST_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupRequest>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...GROUP_REQUEST_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetGroupRequestProps extends SingleQueryParams {
  groupId: string;
  requestId: string;
}

export const GetGroupRequest = async ({
  groupId,
  requestId,
  clientApiParams,
}: GetGroupRequestProps): Promise<ConnectedXMResponse<GroupRequest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/groups/${groupId}/requests/${requestId}`
  );
  return data;
};

export const useGetGroupRequest = (
  groupId: string = "",
  requestId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroupRequest>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupRequest>>(
    GROUP_REQUEST_QUERY_KEY(groupId, requestId),
    (params) => GetGroupRequest({ groupId, requestId, ...params }),
    {
      ...options,
      enabled: !!groupId && !!requestId && (options?.enabled ?? true),
    }
  );
};
