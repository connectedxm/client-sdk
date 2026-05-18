import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ConnectedXMResponse, Image } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_QUERY_KEY } from "./useGetThread";

export const THREAD_IMAGES_QUERY_KEY = (threadId: string): QueryKey => [
  ...THREAD_QUERY_KEY(threadId),
  "STORAGE",
  "IMAGES",
];

interface GetThreadImagesProps extends InfiniteQueryParams {
  threadId: string;
}

export const GetThreadImages = async ({
  threadId,
  pageParam,
  pageSize,
  clientApiParams,
}: GetThreadImagesProps): Promise<ConnectedXMResponse<Image[]>> => {
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
