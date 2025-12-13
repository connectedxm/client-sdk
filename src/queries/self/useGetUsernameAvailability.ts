import {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

import type { ConnectedXMResponse } from "@interfaces";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";

export interface UsernameAvailability {
  available: boolean;
  message: string;
}

export const USERNAME_AVAILABILITY_QUERY_KEY = (username: string): QueryKey => {
  return ["USERNAME_AVAILABILITY", username];
};

export const SET_USERNAME_AVAILABILITY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof USERNAME_AVAILABILITY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetUsernameAvailability>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...USERNAME_AVAILABILITY_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetUsernameAvailabilityProps extends SingleQueryParams {
  username: string;
}

export const GetUsernameAvailability = async ({
  username,
  clientApiParams,
}: GetUsernameAvailabilityProps): Promise<
  ConnectedXMResponse<UsernameAvailability>
> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.get(`/self/username`, {
    params: { username },
  });

  return data;
};

export const useGetUsernameAvailability = (
  username: string,
  options: SingleQueryOptions<ReturnType<typeof GetUsernameAvailability>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetUsernameAvailability>>(
    USERNAME_AVAILABILITY_QUERY_KEY(username),
    (params: SingleQueryParams) =>
      GetUsernameAvailability({ username, ...params }),
    {
      staleTime: 30000, // 30 seconds (backend recommendation)
      retry: false, // Don't retry (backend recommendation)
      ...options,
      enabled: !!username && (options?.enabled ?? true),
    }
  );
};
