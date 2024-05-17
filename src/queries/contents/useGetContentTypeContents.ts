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
import { CONTENT_TYPE_QUERY_KEY } from "./useGetContentType";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CONTENT_TYPE_CONTENTS_QUERY_KEY = (
  contentTypeId: string
): QueryKey => [...CONTENT_TYPE_QUERY_KEY(contentTypeId), "CONTENTS"];

export const SET_CONTENT_TYPE_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeContents>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...CONTENT_TYPE_CONTENTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetContentTypeContentsParams extends InfiniteQueryParams {
  contentTypeId: string;
}

export const GetContentTypeContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentTypeId,
  queryClient,
  clientApiParams,
  locale,
}: GetContentTypeContentsParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/contentTypes/${contentTypeId}/contents`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
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

export const useGetContentTypeContents = (
  contentTypeId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetContentTypeContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentTypeContents>>
  >(
    CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId),
    (params: InfiniteQueryParams) =>
      GetContentTypeContents({ ...params, contentTypeId: contentTypeId || "" }),
    params,
    {
      ...options,
      enabled: !!contentTypeId && (options?.enabled ?? true),
    }
  );
};
