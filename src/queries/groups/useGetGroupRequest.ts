import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { GroupRequest } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_REQUESTS_QUERY_KEY } from "./useGetGroupRequests";

export const GROUP_REQUEST_QUERY_KEY = (
  groupId: string,
  requestId: string
): QueryKey => [...GROUP_REQUESTS_QUERY_KEY(groupId), "REQUESTS", requestId];

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
