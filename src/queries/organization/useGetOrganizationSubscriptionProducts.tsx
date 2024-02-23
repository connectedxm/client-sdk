import type { ConnectedXMResponse, SubscriptionProduct } from "@interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

export const ORGANIZATION_SUBSCRIPTIONS_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "SUBSCRIPTIONS",
];

export interface GetOrganizationSubscriptionProductsProps
  extends InfiniteQueryParams {}

export const GetOrganizationSubscriptionProducts = async ({
  clientApi,
}: GetOrganizationSubscriptionProductsProps): Promise<
  ConnectedXMResponse<SubscriptionProduct[]>
> => {
  const { data } = await clientApi.get<
    ConnectedXMResponse<SubscriptionProduct[]>
  >(`/organization/subscriptions`);

  return data;
};

export const useGetOrganizationSubscriptionProducts = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "clientApi"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetOrganizationSubscriptionProducts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetOrganizationSubscriptionProducts>>
  >(
    ORGANIZATION_SUBSCRIPTIONS_QUERY_KEY(),
    (params: InfiniteQueryParams) =>
      GetOrganizationSubscriptionProducts({ ...params }),
    params,
    options
  );
};
