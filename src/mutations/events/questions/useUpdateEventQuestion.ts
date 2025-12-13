import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUESTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingQuestions";
import { ListingQuestionUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface UpdateEventQuestionParams extends MutationParams {
  eventId: string;
  questionId: string;
  question: ListingQuestionUpdateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const UpdateEventQuestion = async ({
  eventId,
  question,
  questionId,
  clientApiParams,
  queryClient,
}: UpdateEventQuestionParams): Promise<
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

/**
 * @category Mutations
 * @group Events
 */
export const useUpdateEventQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateEventQuestion>>,
      Omit<UpdateEventQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventQuestionParams,
    Awaited<ConnectedXMResponse<RegistrationQuestion>>
  >(UpdateEventQuestion, options);
};
