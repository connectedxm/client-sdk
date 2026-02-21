import { ConnectedXMResponse, SeriesQuestion } from "@src/interfaces";
import useConnectedSingleQuery, {
  GetBaseSingleQueryKeys,
  SingleQueryOptions,
  SingleQueryParams,
} from "../useConnectedSingleQuery";
import { QueryClient, QueryKey } from "@tanstack/react-query";
import { GetClientAPI } from "@src/ClientAPI";
import { useConnected } from "@src/hooks";
import { SERIES_REGISTRATION_QUERY_KEY } from "./useGetSeriesRegistration";

export const SERIES_REGISTRATION_QUESTIONS_QUERY_KEY = (
  seriesId: string
): QueryKey => [...SERIES_REGISTRATION_QUERY_KEY(seriesId), "QUESTIONS"];

export const SET_SERIES_REGISTRATION_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SERIES_REGISTRATION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSeriesRegistrationQuestions>>,
  baseKeys: Parameters<typeof GetBaseSingleQueryKeys> = ["en"]
) => {
  client.setQueryData(
    [
      ...SERIES_REGISTRATION_QUESTIONS_QUERY_KEY(...keyParams),
      ...GetBaseSingleQueryKeys(...baseKeys),
    ],
    response
  );
};

export interface GetSeriesRegistrationQuestionsProps extends SingleQueryParams {
  seriesId: string;
}

export const GetSeriesRegistrationQuestions = async ({
  seriesId,
  clientApiParams,
}: GetSeriesRegistrationQuestionsProps): Promise<
  ConnectedXMResponse<SeriesQuestion[]>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.get(
    `/series/${seriesId}/registration/questions`,
    {}
  );

  return data;
};

export const useGetSeriesRegistrationQuestions = (
  seriesId: string,
  options: SingleQueryOptions<
    ReturnType<typeof GetSeriesRegistrationQuestions>
  > = {}
) => {
  const { authenticated } = useConnected();

  return useConnectedSingleQuery<
    ReturnType<typeof GetSeriesRegistrationQuestions>
  >(
    SERIES_REGISTRATION_QUESTIONS_QUERY_KEY(seriesId),
    (params: SingleQueryParams) =>
      GetSeriesRegistrationQuestions({
        seriesId,
        ...params,
      }),
    {
      ...options,
      enabled: !!authenticated && !!seriesId && (options?.enabled ?? true),
    }
  );
};
