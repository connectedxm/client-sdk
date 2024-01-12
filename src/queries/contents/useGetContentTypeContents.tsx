import { ClientAPI } from "@src/ClientAPI";
import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { SET_CONTENT_QUERY_DATA } from "./useGetContent";
import { CONTENT_TYPE_QUERY_KEY } from "./useGetContentType";
import { ConnectedXMResponse } from "@interfaces";

export const CONTENT_TYPE_CONTENTS_QUERY_KEY = (contentTypeId: string) => [
  ...CONTENT_TYPE_QUERY_KEY(contentTypeId),
  "CONTENTS",
];

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

interface GetContentParams extends InfiniteQueryParams {
  contentTypeId: string;
}

export const GetContentTypeContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  contentTypeId,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await ClientAPI(locale);
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

  return data;
};

const useGetContentTypeContents = (contentTypeId: string) => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentTypeContents>>
  >(
    CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId),
    (params: InfiniteQueryParams) =>
      GetContentTypeContents({ ...params, contentTypeId: contentTypeId || "" }),
    {
      enabled: !!contentTypeId,
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (contentId) => [contentId],
          SET_CONTENT_QUERY_DATA
        ),
    }
  );
};

export default useGetContentTypeContents;
