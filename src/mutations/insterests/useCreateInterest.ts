import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { Interest, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";

interface InterestCreateParams {
  name: string;
}

export interface CreateInterestParams extends MutationParams {
  interest: InterestCreateParams;
}

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
