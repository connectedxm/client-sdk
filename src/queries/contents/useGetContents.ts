import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CONTENTS_QUERY_KEY = (
  featured?: boolean,
  interest?: string
): QueryKey => {
  const key = ["CONTENTS"];
  if (featured) key.push("FEATURED");
  if (interest) key.push(interest);
  return key;
};

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

export interface GetContentsParams extends InfiniteQueryParams {
  featured?: boolean;
  interest?: string;
}

export const GetContents = async ({
  featured,
  interest,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetContentsParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/contents`, {
    params: {
      featured:
        typeof featured !== "undefined"
          ? featured
            ? "true"
            : "false"
          : undefined,
      interest: interest || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetContents = (
  featured?: boolean,
  interest?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetContents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContents>>>(
    CONTENTS_QUERY_KEY(featured, interest),
    (params: InfiniteQueryParams) =>
      GetContents({ featured, interest, ...params }),
    params,
    options
  );
};
