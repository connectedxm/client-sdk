import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

/**
 * @category Params
 * @group Channels
 */
export interface RemoveContentInterestParams extends MutationParams {
  channelId: string;
  contentId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Channels
 */
export const RemoveContentInterest = async ({
  channelId,
  contentId,
  interestId,
  clientApiParams,
}: RemoveContentInterestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/contents/${contentId}/interests/${interestId}`
  );

  return data;
};

/**
 * @category Mutations
 * @group Channels
 */
export const useRemoveContentInterest = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveContentInterest>>,
      Omit<RemoveContentInterestParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveContentInterestParams,
    Awaited<ReturnType<typeof RemoveContentInterest>>
  >(RemoveContentInterest, options);
};
