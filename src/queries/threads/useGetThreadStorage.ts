import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type {
  ConnectedXMResponse,
  ThreadStorageFile,
  ThreadStorageImage,
  ThreadStorageVideo,
} from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_QUERY_KEY } from "./useGetThread";

type ThreadStorageType = "image" | "video" | "file";

export const THREAD_STORAGE_QUERY_KEY = (
  threadId: string,
  type: ThreadStorageType
): QueryKey => [...THREAD_QUERY_KEY(threadId), "STORAGE", type];

interface GetThreadStorageProps<T> extends InfiniteQueryParams {
  threadId: string;
  type: ThreadStorageType;
  /** Marker only — narrows the response generic in callers. */
  _phantom?: T;
}

/** Low-level fetcher. Use the typed wrappers below. */
const getThreadStorage = async <T>({
  threadId,
  type,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadStorageProps<T>): Promise<ConnectedXMResponse<T[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/${threadId}/storage`, {
    params: {
      type,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
    },
  });
  return data;
};

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

export const GetThreadImages = (
  args: Omit<GetThreadStorageProps<ThreadStorageImage>, "type" | "_phantom">
) => getThreadStorage<ThreadStorageImage>({ ...args, type: "image" });

export const SET_THREAD_IMAGES_QUERY_DATA = (
  client: QueryClient,
  threadId: string,
  response: Awaited<ReturnType<typeof GetThreadImages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_STORAGE_QUERY_KEY(threadId, "image"),
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
    THREAD_STORAGE_QUERY_KEY(threadId, "image"),
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

export const GetThreadVideos = (
  args: Omit<GetThreadStorageProps<ThreadStorageVideo>, "type" | "_phantom">
) => getThreadStorage<ThreadStorageVideo>({ ...args, type: "video" });

export const SET_THREAD_VIDEOS_QUERY_DATA = (
  client: QueryClient,
  threadId: string,
  response: Awaited<ReturnType<typeof GetThreadVideos>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_STORAGE_QUERY_KEY(threadId, "video"),
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
    THREAD_STORAGE_QUERY_KEY(threadId, "video"),
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

export const GetThreadFiles = (
  args: Omit<GetThreadStorageProps<ThreadStorageFile>, "type" | "_phantom">
) => getThreadStorage<ThreadStorageFile>({ ...args, type: "file" });

export const SET_THREAD_FILES_QUERY_DATA = (
  client: QueryClient,
  threadId: string,
  response: Awaited<ReturnType<typeof GetThreadFiles>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_STORAGE_QUERY_KEY(threadId, "file"),
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
    THREAD_STORAGE_QUERY_KEY(threadId, "file"),
    (inner: InfiniteQueryParams) => GetThreadFiles({ ...inner, threadId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!threadId && (options?.enabled ?? true),
    }
  );
};
