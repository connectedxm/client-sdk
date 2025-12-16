import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_QUESTIONS_QUERY_KEY } from "@src/queries";
import { EventQuestionUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventListingQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  question: EventQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventListingQuestion = async ({
  eventId,
  question,
  questionId,
  clientApiParams,
  queryClient,
}: UpdateEventListingQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/listings/${eventId}/questions/${questionId}`, question);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_LISTING_QUESTIONS_QUERY_KEY(eventId),
      exact: false,
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventListingQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventListingQuestion>>,
      Omit<UpdateEventListingQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventListingQuestionParams,
    Awaited<ConnectedXMResponse<RegistrationQuestion>>
  >(UpdateEventListingQuestion, options);
};
