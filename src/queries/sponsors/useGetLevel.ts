import { ClientAPI } from "@src/ClientAPI";
import {
  GetBaseInfiniteQueryKeys,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { SponsorshipLevel } from "@interfaces";
import { LEVELS_QUERY_KEY } from "./useGetLevels";
import { GetBaseSingleQueryKeys } from "../useConnectedSingleQuery";

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

interface GetLevelProps extends InfiniteQueryParams {
  levelId: string;
}

export const GetLevel = async ({
  levelId,
  locale,
}: GetLevelProps): Promise<ConnectedXMResponse<SponsorshipLevel[]>> => {
  const clientApi = await ClientAPI(locale);
  const { data } = await clientApi.get(`/levels/${levelId}`, {});
  return data;
};

const useGetLevel = (levelId: string) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetLevel>>>(
    LEVEL_QUERY_KEY(levelId),
    (params: any) => GetLevel(params),
    {
      enabled: !!levelId,
    }
  );
};

export default useGetLevel;
