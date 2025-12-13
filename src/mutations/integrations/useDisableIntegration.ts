import {
  Integration,
  ConnectedXMResponse,
  IntegrationType,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { INTEGRATIONS_QUERY_KEY } from "@src/queries/integrations/useGetIntegrations";
import { INTEGRATION_AUTH_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Integrations
 */
export interface DisableIntegrationParams extends MutationParams {
  type: keyof typeof IntegrationType;
}

/**
 * @category Methods
 * @group Integrations
 */
export const DisableIntegration = async ({
  type,
  clientApiParams,
  queryClient,
}: DisableIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Integration>>(
    `/integrations/${type}/disable`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: INTEGRATIONS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      queryKey: INTEGRATION_AUTH_QUERY_KEY(type),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Integrations
 */
export const useDisableIntegration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DisableIntegration>>,
      Omit<DisableIntegrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DisableIntegrationParams,
    Awaited<ReturnType<typeof DisableIntegration>>
  >(DisableIntegration, options);
};
