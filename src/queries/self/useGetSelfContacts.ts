import type { ConnectedXMResponse, Account } from "@interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { SELF_QUERY_KEY } from "./useGetSelf";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SELF_CONTACTS_QUERY_KEY = (): QueryKey => [
  ...SELF_QUERY_KEY(),
  "CONTACTS",
];

export interface GetSelfContactsProps extends InfiniteQueryParams {}

export const GetSelfContacts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  clientApiParams,
}: GetSelfContactsProps): Promise<ConnectedXMResponse<Account[]>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/self/contacts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetSelfContacts = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSelfContacts>>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetSelfContacts>>>(
    SELF_CONTACTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetSelfContacts({ ...params }),
    params,
    {
      ...options,
      enabled: !!authenticated && (options?.enabled ?? true),
    }
  );
};
