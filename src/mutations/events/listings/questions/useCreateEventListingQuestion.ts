import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { EVENT_LISTING_QUESTIONS_QUERY_KEY } from "@src/queries";
import { EventListingQuestionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventListingQuestionParams extends MutationParams {
  eventId: string;
  question: EventListingQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventListingQuestion = async ({
  eventId,
  question,
  clientApiParams,
  queryClient,
}: CreateEventListingQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/listings/${eventId}/questions`, question);

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
export const useCreateEventListingQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventListingQuestion>>,
      Omit<CreateEventListingQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventListingQuestionParams,
    Awaited<ReturnType<typeof CreateEventListingQuestion>>
  >(CreateEventListingQuestion, options);
};
