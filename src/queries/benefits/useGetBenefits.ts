import { useConnectedXM } from "@src/hooks/useConnectedXM";
import { Benefit } from "@interfaces";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryOptions,
  InfiniteQueryParams,
  setFirstPageData,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse } from "@interfaces";
import { getClientAPI } from "@src/hooks";

export const BENEFITS_QUERY_KEY = (): QueryKey => ["BENEFITS"];

export const SET_BENEFITS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof BENEFITS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetBenefits>>,
  baseKeys: Parameters<typeof GetBaseInfiniteQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...BENEFITS_QUERY_KEY(...keyParams),
      ...GetBaseInfiniteQueryKeys(...baseKeys),
    ],
    setFirstPageData(response)
  );
};

export interface GetBenefitsProps extends InfiniteQueryParams {}

export const GetBenefits = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  apiUrl,
  organizationId,
  getToken,
  getExecuteAs,
  locale,
}: GetBenefitsProps): Promise<ConnectedXMResponse<Benefit[]>> => {
  const clientApi = getClientAPI(
    apiUrl,
    organizationId,
    getToken,
    getExecuteAs,
    locale
  );

  const { data } = await clientApi.get(`/benefits`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

export const useGetBenefits = (
  params: Omit<
    InfiniteQueryParams,
    | "pageParam"
    | "queryClient"
    | "organizationId"
    | "apiUrl"
    | "getToken"
    | "getExecuteAs"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetBenefits>>> = {}
) => {
  const { token } = useConnectedXM();
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetBenefits>>>(
    BENEFITS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetBenefits(params),
    params,
    {
      ...options,
      enabled: !!token && (options?.enabled ?? true),
    }
  );
};
