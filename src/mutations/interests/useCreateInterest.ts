import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { Interest, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { InterestCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Interests
 */
export interface CreateInterestParams extends MutationParams {
  interest: InterestCreateInputs;
}

/**
 * @category Methods
 * @group Interests
 */
export const CreateInterest = async ({
  interest,
  clientApiParams,
}: CreateInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Interest>>(
    `/interests`,
    interest
  );

  return data;
};

/**
 * @category Mutations
 * @group Interests
 */
export const useCreateInterest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateInterest>>,
      Omit<CreateInterestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateInterestParams,
    Awaited<ReturnType<typeof CreateInterest>>
  >(CreateInterest, options);
};
