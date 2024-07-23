import { Content } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const SUBSCRIBED_CONTENTS_QUERY_KEY = (interest?: string): QueryKey => {
  const key = ["SUBSCRIBED_CONTENTS"];
  if (interest) key.push(interest);
  return key;
};

export interface GetSubscribedContentsParams extends InfiniteQueryParams {
  interest?: string;
}

export const GetSubscribedContents = async ({
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
