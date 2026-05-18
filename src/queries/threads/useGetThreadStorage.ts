import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type {
  BaseVideo,
  ConnectedXMResponse,
  File,
  Image,
} from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_QUERY_KEY } from "./useGetThread";

const THREAD_STORAGE_BASE_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "STORAGE",
];

export const THREAD_IMAGES_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_STORAGE_BASE_KEY(threadId),
  "IMAGES",
];

export const THREAD_VIDEOS_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_STORAGE_BASE_KEY(threadId),
  "VIDEOS",
];

export const THREAD_FILES_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_STORAGE_BASE_KEY(threadId),
  "FILES",
];

interface GetThreadStorageProps extends InfiniteQueryParams {
  threadId: string;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

export const GetThreadImages = async ({
  threadId,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadStorageProps): Promise<ConnectedXMResponse<Image[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/storage/images`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return data;
};

export const SET_THREAD_IMAGES_QUERY_DATA = (
  client: QueryClient,
  threadId: string,
  response: Awaited<ReturnType<typeof GetThreadImages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_IMAGES_QUERY_KEY(threadId),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export const useGetThreadImages = (
  threadId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadImages>>
  > = {}
) => {
  const { authenticated } = useConnected();
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetThreadImages>>>(
    THREAD_IMAGES_QUERY_KEY(threadId),
    (inner: InfiniteQueryParams) => GetThreadImages({ ...inner, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------

export const GetThreadVideos = async ({
  threadId,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadStorageProps): Promise<ConnectedXMResponse<BaseVideo[]>> => {
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

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

export const GetThreadFiles = async ({
  threadId,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadStorageProps): Promise<ConnectedXMResponse<File[]>> => {
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
