import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUESTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingQuestions";

export interface DeleteListingQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
}

export const DeleteListingQuestion = async ({
  eventId,
  questionId,
  clientApiParams,
  queryClient,
}: DeleteListingQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/listings/${eventId}/questions/${questionId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LISTING_QUESTIONS_QUERY_KEY(eventId),
    });
  }

  return data;
};

export const useDeleteListingQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteListingQuestion>>,
      Omit<DeleteListingQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteListingQuestionParams,
    Awaited<ReturnType<typeof DeleteListingQuestion>>
  >(DeleteListingQuestion, options);
};
