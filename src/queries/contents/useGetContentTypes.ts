import { ContentType } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { CacheIndividualQueries } from "@src/utilities/CacheIndividualQueries";
import { QueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_QUERY_KEY } from "./useGetContentType";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_TYPES_QUERY_KEY = () => ["CONTENT_TYPES"];

export const SET_CONTENT_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypes>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_TYPES_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

interface GetContentParams extends InfiniteQueryParams {}

export const GetContentTypes = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  queryClient,
  clientApi,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<ContentType[]>> => {
  const { data } = await clientApi.get(`/contentTypes`, {
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
      (contentTypeId) => CONTENT_TYPE_QUERY_KEY(contentTypeId),
      locale
    );
  }

  return data;
};

export const useGetContentTypes = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetContentTypes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContentTypes>>>(
    CONTENT_TYPES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetContentTypes({ ...params }),
    params,
    options
  );
};
