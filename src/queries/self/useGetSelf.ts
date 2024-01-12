import {
  GetBaseSingleQueryKeys,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ClientAPI } from "@src/ClientAPI";
import { useConnectedXM } from "@hooks/useConnectedXM";
import type { Self } from "@interfaces";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { SET_ACCOUNT_QUERY_DATA } from "@queries/accounts/useGetAccount";

export const SELF_QUERY_KEY = () => ["SELF"];

export const SET_SELF_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SELF_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSelf>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...SELF_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

interface GetSelfProps extends SingleQueryParams {}

export const GetSelf = async ({
  locale,
}: GetSelfProps): Promise<ConnectedXMResponse<Self>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/self`);
  return data;
};

const useGetSelf = () => {
  const { token } = useConnectedXM();
  const queryClient = useQueryClient();

  return useConnectedSingleQuery<Awaited<ReturnType<typeof GetSelf>>>(
    SELF_QUERY_KEY(),
    (params: any) => GetSelf({ ...params }),
    {
      enabled: !!token,
      onSuccess: (response) => {
        SET_ACCOUNT_QUERY_DATA(queryClient, [response.data.id], response);
        SET_ACCOUNT_QUERY_DATA(queryClient, [response.data.username], response);
      },
    }
  );
};

export default useGetSelf;
