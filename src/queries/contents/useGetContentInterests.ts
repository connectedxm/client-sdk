import { Interest } from "@interfaces";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const CONTENT_INTERESTS_QUERY_KEY = (): QueryKey => {
  const key = ["CONTENTS_INTERESTS"];
  return key;
};

export interface GetContentInterestsParams extends InfiniteQueryParams {}

export const GetContentInterests = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetContentInterestsParams): Promise<ConnectedXMResponse<Interest[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/contents/interests`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetContentInterests = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetContentInterests>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetContentInterests>>
  >(
    CONTENT_INTERESTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetContentInterests({ ...params }),
    params,
    options
  );
};
