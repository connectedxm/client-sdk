import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface UpdateSurveySearchListResponseParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  questionId: string;
  searchListValueId: string;
}

export const UpdateSurveySearchListResponse = async ({
  surveyId,
  submissionId,
  questionId,
  searchListValueId,
  clientApiParams,
}: UpdateSurveySearchListResponseParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<null>>(
    `/surveys/${surveyId}/submissions/${submissionId}/questions/${questionId}`,
    { response: searchListValueId }
  );

  return data;
};

export const useUpdateSurveySearchListResponse = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateSurveySearchListResponse>>,
      Omit<UpdateSurveySearchListResponseParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSurveySearchListResponseParams,
    Awaited<ConnectedXMResponse<null>>
  >(UpdateSurveySearchListResponse, options);
};
