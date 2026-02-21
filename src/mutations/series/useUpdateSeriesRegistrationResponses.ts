import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { SERIES_REGISTRATION_QUERY_KEY } from "@src/queries";

export interface UpdateSeriesRegistrationResponsesParams
  extends MutationParams {
  seriesId: string;
  responses?: { questionId: string; value: string }[];
}

export const UpdateSeriesRegistrationResponses = async ({
  seriesId,
  responses = [],
  clientApiParams,
  queryClient,
}: UpdateSeriesRegistrationResponsesParams): Promise<
  ConnectedXMResponse<Record<string, never>>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<Record<string, never>>
  >(`/series/${seriesId}/registration/responses`, { responses });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: SERIES_REGISTRATION_QUERY_KEY(seriesId),
    });
  }

  return data;
};

export const useUpdateSeriesRegistrationResponses = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSeriesRegistrationResponses>>,
      Omit<
        UpdateSeriesRegistrationResponsesParams,
        "queryClient" | "clientApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSeriesRegistrationResponsesParams,
    Awaited<ReturnType<typeof UpdateSeriesRegistrationResponses>>
  >(UpdateSeriesRegistrationResponses, options);
};
