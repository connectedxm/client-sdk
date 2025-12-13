import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Channels
 */
export interface RemoveChannelInterestParams extends MutationParams {
  channelId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const RemoveChannelInterest = async ({
  channelId,
  interestId,
  clientApiParams,
}: RemoveChannelInterestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/interests/${interestId}`
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useRemoveChannelInterest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveChannelInterest>>,
      Omit<RemoveChannelInterestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveChannelInterestParams,
    Awaited<ReturnType<typeof RemoveChannelInterest>>
  >(RemoveChannelInterest, options);
};
