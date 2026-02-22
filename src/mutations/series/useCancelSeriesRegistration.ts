import {
  ConnectedXMResponse,
  SeriesRegistration,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SERIES_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface CancelSeriesRegistrationParams extends MutationParams {
  seriesId: string;
}

export const CancelSeriesRegistration = async ({
  seriesId,
  clientApiParams,
  queryClient,
}: CancelSeriesRegistrationParams): Promise<
  ConnectedXMResponse<SeriesRegistration>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<SeriesRegistration>
  >(`/series/${seriesId}/registration/cancel`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATION_QUERY_KEY(seriesId),
    });
  }

  return data;
};

export const useCancelSeriesRegistration = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CancelSeriesRegistration>>,
      Omit<
        CancelSeriesRegistrationParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelSeriesRegistrationParams,
    Awaited<ReturnType<typeof CancelSeriesRegistration>>
  >(CancelSeriesRegistration, options);
};
