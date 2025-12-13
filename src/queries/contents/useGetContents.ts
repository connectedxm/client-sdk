import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  GetBaseInfiniteQueryKeys,
  setFirstPageData,
  InfiniteQueryOptions,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CONTENTS_QUERY_KEY = (
  type?: "video" | "audio" | "article",
  featured?: boolean,
  interest?: string,
  past?: boolean
): QueryKey => {
  const key = ["CONTENTS"];
  if (type) key.push(type);
  if (featured) key.push("FEATURED");
  if (interest) key.push(interest);
  if (typeof past !== "undefined") key.push(past ? "PAST" : "UPCOMING");
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
  type?: "video" | "audio" | "article";
  featured?: boolean;
  interest?: string;
  past?: boolean;
}

export const GetContents = async ({
  type,
  featured,
  interest,
  past,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetContentsParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/contents`, {
    params: {
      type: type || undefined,
      featured:
        typeof featured !== "undefined"
          ? featured
            ? "true"
            : "false"
          : undefined,
      interest: interest || undefined,
      past,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetContents = (
  type?: "video" | "audio" | "article",
  featured?: boolean,
  interest?: string,
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetContents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContents>>>(
    CONTENTS_QUERY_KEY(type, featured, interest, past),
    (params: InfiniteQueryParams) =>
      GetContents({ type, featured, interest, past, ...params }),
    params,
    options
  );
};
