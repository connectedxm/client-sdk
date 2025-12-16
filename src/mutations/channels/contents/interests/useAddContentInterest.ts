import { ConnectedXMResponse, Interest } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Channels
 */
export interface AddContentInterestParams extends MutationParams {
  channelId: string;
  contentId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const AddContentInterest = async ({
  channelId,
  contentId,
  interestId,
  clientApiParams,
}: AddContentInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Interest>>(
    `/channels/${channelId}/contents/${contentId}/interests/${interestId}`
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useAddContentInterest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddContentInterest>>,
      Omit<AddContentInterestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddContentInterestParams,
    Awaited<ReturnType<typeof AddContentInterest>>
  >(AddContentInterest, options);
};
