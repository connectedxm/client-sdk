import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_QUERY_KEY } from "./useGetOrganization";
import useConnectedSingleQuery, {
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY = () => [
  ...ORGANIZATION_QUERY_KEY(),
  "PAYMENT_INTEGRATION",
];

export interface GetOrganizationPaymentIntegrationParams
  extends SingleQueryParams {}

export const GetOrganizationPaymentIntegration = async ({
  clientApi,
}: GetOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<{
    connectionId: string;
    type: "stripe" | "paypal";
  }>
> => {
  const { data } = await clientApi.get<
    ConnectedXMResponse<{
      connectionId: string;
      type: "stripe" | "paypal";
    }>
  >(`/organization/payment-integration`);

  return data;
};

export const useGetOrganizationPaymentIntegration = (
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  > = {}
) => {
  return useConnectedSingleQuery(
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(),
    (params: any) => GetOrganizationPaymentIntegration({ ...params }),
    options
  );
};
