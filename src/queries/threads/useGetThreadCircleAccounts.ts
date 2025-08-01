import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import type { ConnectedXMResponse, ThreadCircleAccount } from "@interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { THREAD_CIRCLE_QUERY_KEY } from "./useGetThreadCircle";

export const THREAD_CIRCLE_ACCOUNTS_QUERY_KEY = (
  circleId: string
): QueryKey => [...THREAD_CIRCLE_QUERY_KEY(circleId), "ACCOUNTS"];

export const SET_THREAD_CIRCLE_ACCOUNTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_ACCOUNTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircleAccounts>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetThreadCircleAccountsProps extends InfiniteQueryParams {
  circleId: string;
  role?: string;
}

export const GetThreadCircleAccounts = async ({
  circleId,
  pageParam,
  pageSize,
  orderBy,
  search,
  role,
  clientApiParams,
}: GetThreadCircleAccountsProps): Promise<
  ConnectedXMResponse<ThreadCircleAccount[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/threads/circles/${circleId}/accounts`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        role: role || undefined,
      },
    }
  );
  return data;
};

export const useGetThreadCircleAccounts = (
  circleId: string = "",
  params: Omit<
    GetThreadCircleAccountsProps,
    "circleId" | "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetThreadCircleAccounts>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetThreadCircleAccounts>>
  >(
    THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId),
    (params: Omit<GetThreadCircleAccountsProps, "circleId">) =>
      GetThreadCircleAccounts({ ...params, circleId }),
    params,
    {
      ...options,
      enabled: !!authenticated && !!circleId && (options?.enabled ?? true),
    }
  );
};
