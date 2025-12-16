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
export interface AddChannelInterestParams extends MutationParams {
  channelId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const AddChannelInterest = async ({
  channelId,
  interestId,
  clientApiParams,
}: AddChannelInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Interest>>(
    `/channels/${channelId}/interests/${interestId}`
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useAddChannelInterest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddChannelInterest>>,
      Omit<AddChannelInterestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddChannelInterestParams,
    Awaited<ReturnType<typeof AddChannelInterest>>
  >(AddChannelInterest, options);
};
