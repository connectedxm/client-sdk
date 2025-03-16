import { Account, ConnectedXMResponse } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@src/hooks";

export const SELF_DELEGATE_OF_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "DELEGATE_OF",
];

export interface GetSelfDelegateOfProps extends InfiniteQueryParams {}

export const GetSelfDelegateOf = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfDelegateOfProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/delegateof`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });

  return data;
};

export const useGetSelfDelegateOf = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfDelegateOf>>
  > = {}
) => {
  const { authenticated } = useConnectedXM();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSelfDelegateOf>>
  >(
    SELF_DELEGATE_OF_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfDelegateOf({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
