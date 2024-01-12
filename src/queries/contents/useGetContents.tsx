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
import { ConnectedXMResponse } from "@interfaces";

export const CONTENTS_QUERY_KEY = () => ["CONTENTS"];

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

interface GetContentParams extends InfiniteQueryParams {}

export const GetContents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  locale,
}: GetContentParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/contents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

const useGetContents = () => {
  const queryClient = useQueryClient();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContents>>>(
    CONTENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetContents({ ...params }),
    {
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

export default useGetContents;
