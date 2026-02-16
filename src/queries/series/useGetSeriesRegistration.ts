import { ConnectedXMResponse, SeriesRegistration } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { SERIES_QUERY_KEY } from "./useGetSeries";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";

export const SERIES_REGISTRATION_QUERY_KEY = (seriesId: string): QueryKey => [
  ...SERIES_QUERY_KEY(seriesId),
  "REGISTRATION",
];

export const SET_SERIES_REGISTRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_REGISTRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesRegistration>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SERIES_REGISTRATION_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSeriesRegistrationProps extends SingleQueryParams {
  seriesId: string;
}

export const GetSeriesRegistration = async ({
  seriesId,
  clientApiParams,
}: GetSeriesRegistrationProps): Promise<
  ConnectedXMResponse<SeriesRegistration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(`/series/${seriesId}/registration`);

  return data;
};

export const useGetSeriesRegistration = (
  seriesId: string,
  options: SingleQueryOptions<ReturnType<typeof GetSeriesRegistration>> = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<ReturnType<typeof GetSeriesRegistration>>(
    SERIES_REGISTRATION_QUERY_KEY(seriesId),
    (params: SingleQueryParams) =>
      GetSeriesRegistration({
        seriesId,
        ...params,
      }),
    {
      ...options,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: !!authenticated && !!seriesId && (options?.enabled ?? true),
    }
  );
};
