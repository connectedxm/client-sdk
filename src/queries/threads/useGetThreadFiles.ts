import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ConnectedXMResponse, File } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_QUERY_KEY } from "./useGetThread";

export const THREAD_FILES_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "STORAGE",
  "FILES",
];

interface GetThreadFilesProps extends InfiniteQueryParams {
  threadId: string;
}

export const GetThreadFiles = async ({
  threadId,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadFilesProps): Promise<ConnectedXMResponse<File[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/storage/files`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return data;
};

export const SET_THREAD_FILES_QUERY_DATA = (
  client: QueryClient,
  threadId: string,
  response: Awaited<ReturnType<typeof GetThreadFiles>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_FILES_QUERY_KEY(threadId),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export const useGetThreadFiles = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadFiles>>
  > = {}
) => {
  const { authenticated } = useConnected();
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreadFiles>>>(
    THREAD_FILES_QUERY_KEY(threadId),
    (inner: InfiniteQueryParams) => GetThreadFiles({ ...inner, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};
