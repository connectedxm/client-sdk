import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";
import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUESTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingQuestions";
import { ListingQuestionCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Events
 */
export interface CreateEventQuestionParams extends MutationParams {
  eventId: string;
  question: ListingQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Events
 */
export const CreateEventQuestion = async ({
  eventId,
  question,
  clientApiParams,
  queryClient,
}: CreateEventQuestionParams): Promise<
  ConnectedXMResponse<RegistrationQuestion>
> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<
    ConnectedXMResponse<RegistrationQuestion>
  >(`/listings/${eventId}/questions`, question);

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
export const useCreateEventQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateEventQuestion>>,
      Omit<CreateEventQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventQuestionParams,
    Awaited<ReturnType<typeof CreateEventQuestion>>
  >(CreateEventQuestion, options);
};
