import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_QUESTIONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface DeleteEventListingQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const DeleteEventListingQuestion = async ({
  eventId,
  questionId,
  clientApiParams,
  queryClient,
}: DeleteEventListingQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/listings/${eventId}/questions/${questionId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_QUESTIONS_QUERY_KEY(eventId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useDeleteEventListingQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteEventListingQuestion>>,
      Omit<DeleteEventListingQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventListingQuestionParams,
    Awaited<ReturnType<typeof DeleteEventListingQuestion>>
  >(DeleteEventListingQuestion, options);
};
