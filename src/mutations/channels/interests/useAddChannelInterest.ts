import { ConnectedXMResponse, Interest } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";
import { ChannelInterestCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Channels
 */
export interface AddChannelInterestParams extends MutationParams {
  channelId: string;
  interest: ChannelInterestCreateInputs;
}

/**
 * @category Methods
 * @group Channels
 */
export const AddChannelInterest = async ({
  channelId,
  interest,
  clientApiParams,
}: AddChannelInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Interest>>(
    `/channels/${channelId}/interests`,
    interest
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
