import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { ConnectedXMResponse, RegistrationQuestion } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { LISTING_QUESTIONS_QUERY_KEY } from "@src/queries/listings/useGetListingQuestions";

export interface CreateListingQuestionParams extends MutationParams {
  eventId: string;
  question: {
    name: string;
    type: string;
    required: boolean;
    mutable: boolean;
    choices: {
      id: number | null;
      value: string;
    }[];
  };
}

export const CreateListingQuestion = async ({
  eventId,
  question,
  clientApiParams,
  queryClient,
}: CreateListingQuestionParams): Promise<
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

export const useCreateListingQuestion = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateListingQuestion>>,
      Omit<CreateListingQuestionParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateListingQuestionParams,
    Awaited<ReturnType<typeof CreateListingQuestion>>
  >(CreateListingQuestion, options);
};
