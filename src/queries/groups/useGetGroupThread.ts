import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

import type { Thread } from "@interfaces";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { SET_THREAD_QUERY_DATA } from "../threads";

export const GROUP_THREAD_QUERY_KEY = (groupId: string): QueryKey => [
  ...GROUP_QUERY_KEY(groupId),
  "THREAD",
];

export interface GetGroupThreadProps extends SingleQueryParams {
  groupId: string;
}

export const GetGroupThread = async ({
  groupId,
  clientApiParams,
  queryClient,
}: GetGroupThreadProps): Promise<ConnectedXMResponse<Thread>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get<ConnectedXMResponse<Thread>>(
    `/groups/${groupId}/thread`
  );

  if (queryClient && data.status === "ok") {
    SET_THREAD_QUERY_DATA(queryClient, [data.data.id], data);
  }

  return data;
};

export const useGetGroupThread = (
  groupId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetGroupThread>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetGroupThread>>(
    GROUP_THREAD_QUERY_KEY(groupId),
    (params) => GetGroupThread({ groupId, ...params }),
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
