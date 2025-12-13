import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const SUBSCRIBED_CONTENTS_QUERY_KEY = (
  type?: string,
  interest?: string
): QueryKey => {
  const key = ["SUBSCRIBED_CONTENTS"];
  if (type) key.push(type);
  if (interest) key.push(interest);
  return key;
};

export interface GetSubscribedContentsParams extends InfiniteQueryParams {
  type?: "video" | "audio" | "article";
  interest?: string;
}

export const GetSubscribedContents = async ({
  type,
  interest,
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSubscribedContentsParams): Promise<ConnectedXMResponse<Content[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/contents/subscribed`, {
    params: {
      type: type || undefined,
      interest: interest || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSubscribedContents = (
  type?: "video" | "audio" | "article",
  interest?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSubscribedContents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSubscribedContents>>
  >(
    SUBSCRIBED_CONTENTS_QUERY_KEY(interest),
    (params: InfiniteQueryParams) =>
      GetSubscribedContents({ interest, ...params }),
    params,
    options
  );
};
