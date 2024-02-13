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
import {
  CONTENT_TYPE_QUERY_KEY,
  SET_CONTENT_TYPE_QUERY_DATA,
} from "./useGetContentType";
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
      SET_CONTENT_TYPE_QUERY_DATA
    );
  }

  return data;
};

export const useGetContentTypes = (
  params: Omit<InfiniteQueryParams, "queryClient" | "clientApi">,
  options: InfiniteQueryOptions<ReturnType<typeof GetContentTypes>> = {}
) => {
  return useConnectedInfiniteQuery<ReturnType<typeof GetContentTypes>>(
    CONTENT_TYPES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetContentTypes({ ...params }),
    params,
    options
  );
};
