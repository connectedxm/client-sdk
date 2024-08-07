import { QueryClient, QueryKey, SetDataOptions } from "@tanstack/react-query";
import { ThreadMember } from "@interfaces";
import { THREAD_QUERY_KEY } from "./useGetThread";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";

export const THREAD_MEMBER_QUERY_KEY = (
  threadId: string,
  accountId: string
): QueryKey => {
  return [...THREAD_QUERY_KEY(threadId, accountId)];
};

export const SET_THREAD_MEMBER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_MEMBER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadMember>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"],
  options?: SetDataOptions
) => {
  client.setQueryData(
    [
      ...THREAD_MEMBER_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response,
    options
  );
};

export interface GetThreadMemberProps {
  threadId: string;
  accountId: string;
  clientApiParams?: any;
}

export const GetThreadMember = async ({
  threadId,
  accountId,
  clientApiParams,
}: GetThreadMemberProps): Promise<ConnectedXMResponse<ThreadMember>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/threads/${threadId}/members/${accountId}`
  );
  return data;
};

export const useGetThreadMember = (
  threadId: string,
  accountId: string,
  options: SingleQueryOptions<ReturnType<typeof GetThreadMember>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadMember>>(
    THREAD_MEMBER_QUERY_KEY(threadId, accountId),
    (params) => GetThreadMember({ threadId, accountId, ...params }),
    {
      ...options,
      enabled: !!threadId && (options?.enabled ?? true),
    }
  );
};
