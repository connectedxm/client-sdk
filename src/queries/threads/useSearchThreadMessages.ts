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
  ThreadMessageSearchResult,
} from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SEARCH_THREAD_MESSAGES_QUERY_KEY = (): QueryKey => [
  "THREADS",
  "SEARCH",
];

export const SET_SEARCH_THREAD_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCH_THREAD_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof SearchThreadMessages>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SEARCH_THREAD_MESSAGES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface SearchThreadMessagesProps extends InfiniteQueryParams {}

export const SearchThreadMessages = async ({
  pageParam,
  pageSize,
  search,
  clientApiParams,
}: SearchThreadMessagesProps): Promise<
  ConnectedXMResponse<ThreadMessageSearchResult[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/threads/search`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * Search messages across every thread the authenticated user is a
 * participant of. Results include the parent thread inlined under each
 * row (subject + participant accounts) so UIs can group / render thread
 * context without follow-up queries.
 *
 * Disabled when `search` is empty so the hook doesn't fan-out the full
 * inbox on mount.
 */
export const useSearchThreadMessages = (
  params: Omit<
    SearchThreadMessagesProps,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof SearchThreadMessages>>
  > = {}
) => {
  const { authenticated } = useConnected();
  const hasSearch = !!params.search && params.search.trim().length > 0;

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof SearchThreadMessages>>
  >(
    SEARCH_THREAD_MESSAGES_QUERY_KEY(),
    (innerParams: SearchThreadMessagesProps) =>
      SearchThreadMessages(innerParams),
    params,
    {
      ...options,
      enabled: !!authenticated && hasSearch && (options?.enabled ?? true),
    }
  );
};
