import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUESTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingQuestions";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventQuestion = async ({
  eventId,
  questionId,
  clientApiParams,
  queryClient,
}: DeleteEventQuestionParams): Promise<
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

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventQuestion>>,
      Omit<DeleteEventQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventQuestionParams,
    Awaited<ReturnType<typeof DeleteEventQuestion>>
  >(DeleteEventQuestion, options);
};
