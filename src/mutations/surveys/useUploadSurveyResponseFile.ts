import { ConnectedXMResponse, File } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface UploadSurveyResponseFileParams extends MutationParams {
  surveyId: string;
  submissionId: string;
  dataUri: string;
  name?: string;
}

export const UploadSurveyResponseFile = async ({
  clientApiParams,
  surveyId,
  submissionId,
  dataUri,
  name,
}: UploadSurveyResponseFileParams): Promise<ConnectedXMResponse<File>> => {
  const clientApi = await GetClientAPI(clientApiParams);

  const { data } = await clientApi.post<ConnectedXMResponse<File>>(
    `/surveys/${surveyId}/submissions/${submissionId}/files`,
    {
      dataUri,
      name,
    }
  );

  return data;
};

export const useUploadSurveyResponseFile = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UploadSurveyResponseFile>>,
      Omit<UploadSurveyResponseFileParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UploadSurveyResponseFileParams,
    Awaited<ReturnType<typeof UploadSurveyResponseFile>>
  >(UploadSurveyResponseFile, options);
};
