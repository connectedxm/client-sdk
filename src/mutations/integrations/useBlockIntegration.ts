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
export interface BlockIntegrationParams extends MutationParams {
  type: keyof typeof IntegrationType;
}

/**
 * @category Methods
 * @group Integrations
 */
export const BlockIntegration = async ({
  type,
  clientApiParams,
  queryClient,
}: BlockIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Integration>>(
    `/integrations/${type}/block`
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
export const useBlockIntegration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof BlockIntegration>>,
      Omit<BlockIntegrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    BlockIntegrationParams,
    Awaited<ReturnType<typeof BlockIntegration>>
  >(BlockIntegration, options);
};
