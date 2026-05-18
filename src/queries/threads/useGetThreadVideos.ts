import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { BaseVideo, ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_QUERY_KEY } from "./useGetThread";

export const THREAD_VIDEOS_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "STORAGE",
  "VIDEOS",
];

interface GetThreadVideosProps extends InfiniteQueryParams {
  threadId: string;
}

export const GetThreadVideos = async ({
  threadId,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadVideosProps): Promise<ConnectedXMResponse<BaseVideo[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/storage/videos`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return data;
};

export const SET_THREAD_VIDEOS_QUERY_DATA = (
  client: QueryClient,
  threadId: string,
  response: Awaited<ReturnType<typeof GetThreadVideos>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_VIDEOS_QUERY_KEY(threadId),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export const useGetThreadVideos = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadVideos>>
  > = {}
) => {
  const { authenticated } = useConnected();
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreadVideos>>>(
    THREAD_VIDEOS_QUERY_KEY(threadId),
    (inner: InfiniteQueryParams) => GetThreadVideos({ ...inner, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};
