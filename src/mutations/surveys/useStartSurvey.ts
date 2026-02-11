import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface StartSurveyParams extends MutationParams {
  surveyId: string;
  passId?: string;
}

export const StartSurvey = async ({
  surveyId,
  passId,
  clientApiParams,
}: StartSurveyParams): Promise<ConnectedXMResponse<{ id: string }>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<{ id: string }>>(
    `/surveys/${surveyId}/submissions`,
    { passId }
  );

  return data;
};

export const useStartSurvey = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof StartSurvey>>,
      Omit<StartSurveyParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    StartSurveyParams,
    Awaited<ReturnType<typeof StartSurvey>>
  >(StartSurvey, options);
};
