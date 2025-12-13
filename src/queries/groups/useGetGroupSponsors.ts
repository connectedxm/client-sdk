import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { Account } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GROUP_QUERY_KEY } from "./useGetGroup";
import { ConnectedXMResponse } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";

export const GROUP_SPONSORS_QUERY_KEY = (groupId: string): QueryKey => [
  ...GROUP_QUERY_KEY(groupId),
  "SPONSORS",
];

export const SET_GROUP_SPONSORS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof GROUP_SPONSORS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetGroupSponsors>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...GROUP_SPONSORS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetGroupSponsorsProps extends InfiniteQueryParams {
  groupId: string;
}

export const GetGroupSponsors = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  groupId,
  clientApiParams,
}: GetGroupSponsorsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/groups/${groupId}/sponsors`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetGroupSponsors = (
  groupId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetGroupSponsors>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetGroupSponsors>>
  >(
    GROUP_SPONSORS_QUERY_KEY(groupId),
    (params: InfiniteQueryParams) => GetGroupSponsors({ groupId, ...params }),
    params,
    {
      ...options,
      enabled: !!groupId && (options?.enabled ?? true),
    }
  );
};
