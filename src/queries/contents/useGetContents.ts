import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { CONTENT_QUERY_KEY } from "./useGetContent";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENTS_QUERY_KEY = (): QueryKey => ["CONTENTS"];

export const SET_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetContentParams extends InfiniteQueryParams {}

export const GetContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<Content[]>> => {
  const { data } = await clientApi.get(`/contents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  if (queryClient && data.status === "ok") {
    CacheIndividualQueries(
      data,
      queryClient,
      (contentId) => CONTENT_QUERY_KEY(contentId),
      locale
    );
  }

  return data;
};

export const useGetContents = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetContents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContents>>>(
    CONTENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetContents({ ...params }),
    params,
    options
  );
};
