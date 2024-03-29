import { QueryClient, QueryKey } from "@tanstack/react-query";
import { ConnectedXMResponse, SponsorshipLevel } from "@interfaces";
import { LEVELS_QUERY_KEY } from "./useGetLevels";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { GetClientAPI } from "@src/ClientAPI";

export const LEVEL_QUERY_KEY = (levelId: string): QueryKey => [
  ...LEVELS_QUERY_KEY(),
  levelId,
];

export const SET_LEVEL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LEVEL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLevel>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [...LEVEL_QUERY_KEY(...keyParams), ...GetBaseSingleQueryKeys(...baseKeys)],
    response
  );
};

export interface GetLevelProps extends SingleQueryParams {
  levelId: string;
}

export const GetLevel = async ({
  levelId,
  clientApiParams,
}: GetLevelProps): Promise<ConnectedXMResponse<SponsorshipLevel>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/levels/${levelId}`, {});
  return data;
};

export const useGetLevel = (
  levelId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLevel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLevel>>(
    LEVEL_QUERY_KEY(levelId),
    (params: SingleQueryParams) => GetLevel({ levelId, ...params }),
    {
      ...options,
      enabled: !!levelId && (options?.enabled ?? true),
    }
  );
};
