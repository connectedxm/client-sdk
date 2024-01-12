import { ClientAPI } from "@src/ClientAPI";
import { ContentType } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
} from "../useConnectedInfiniteQuery";
import CacheIndividualQueries from "@src/utilities/CacheIndividualQueries";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { SET_CONTENT_TYPE_QUERY_DATA } from "./useGetContentType";
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
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<ContentType[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/contentTypes`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetContentTypes = () => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContentTypes>>>(
    CONTENT_TYPES_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetContentTypes({ ...params }),
    {
      onSuccess: (data) =>
        CacheIndividualQueries(
          data,
          queryClient,
          (contentTypeId) => [contentTypeId],
          SET_CONTENT_TYPE_QUERY_DATA
        ),
    }
  );
};

export default useGetContentTypes;
