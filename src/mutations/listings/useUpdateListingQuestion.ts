import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUESTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingQuestions";

export interface UpdateListingQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  question: {
    name: string;
    required: boolean;
    mutable: boolean;
    sortOrder?: number;
    choices: {
      id: number | null;
      value: string;
    }[];
  };
}

export const UpdateListingQuestion = async ({
  eventId,
  question,
  questionId,
  clientApiParams,
  queryClient,
}: UpdateListingQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/listings/${eventId}/questions/${questionId}`, question);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_QUESTIONS_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

export const useUpdateListingQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateListingQuestion>>,
      Omit<UpdateListingQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateListingQuestionParams,
    Awaited<ConnectedXMResponse<RegistrationQuestion>>
  >(UpdateListingQuestion, options);
};
