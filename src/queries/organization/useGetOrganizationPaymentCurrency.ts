import type { ConnectedXMResponse } from "@interfaces";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export const ORGANIZATION_PAYMENT_CURRENCY_QUERY_KEY = (): QueryKey => [
  "ORGANIZATION_PAYMENT_CURRENCY",
];

export interface GetOrganizationPaymentCurrencyParams
  extends SingleQueryParams {}

export interface OrganizationPaymentCurrency {
  currencyCode: string;
}

export const GetOrganizationPaymentCurrency = async ({
  clientApiParams,
}: GetOrganizationPaymentCurrencyParams): Promise<
  ConnectedXMResponse<OrganizationPaymentCurrency>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/organization/payment/currency`);
  return data;
};

export const useGetOrganizationPaymentCurrency = (
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentCurrency>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationPaymentCurrency>
  >(
    ORGANIZATION_PAYMENT_CURRENCY_QUERY_KEY(),
    (params: SingleQueryParams) =>
      GetOrganizationPaymentCurrency({ ...params }),
    options
  );
};
