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

export interface EnableIntegrationParams extends MutationParams {
  type: keyof typeof IntegrationType;
}

export const EnableIntegration = async ({
  type,
  clientApiParams,
  queryClient,
}: EnableIntegrationParams): Promise<ConnectedXMResponse<Integration>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Integration>>(
    `/integrations/${type}/enable`
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

export const useEnableIntegration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof EnableIntegration>>,
      Omit<EnableIntegrationParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    EnableIntegrationParams,
    Awaited<ReturnType<typeof EnableIntegration>>
  >(EnableIntegration, options);
};
