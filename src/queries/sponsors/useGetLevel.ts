import { QueryClient } from "@tanstack/react-query";
import { ConnectedXMResponse, SponsorshipLevel } from "@interfaces";
import { LEVELS_QUERY_KEY } from "./useGetLevels";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";

export const LEVEL_QUERY_KEY = (levelId: string) => [
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

interface GetLevelProps extends SingleQueryParams {
  levelId: string;
}

export const GetLevel = async ({
  levelId,
  clientApi,
}: GetLevelProps): Promise<ConnectedXMResponse<SponsorshipLevel>> => {
  const { data } = await clientApi.get(`/levels/${levelId}`, {});
  return data;
};

const useGetLevel = (
  levelId: string,
  params: Omit<SingleQueryParams, "clientApi"> = {},
  options: SingleQueryOptions<ReturnType<typeof GetLevel>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLevel>>(
    LEVEL_QUERY_KEY(levelId),
    (params: SingleQueryParams) => GetLevel({ levelId, ...params }),
    params,
    {
      ...options,
      enabled: !!levelId && (options?.enabled ?? true),
    }
  );
};

export default useGetLevel;
