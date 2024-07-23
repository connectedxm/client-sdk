import { ConnectedXMResponse, Interest } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface AddChannelInterest {
  name: string;
}

export interface AddChannelInterestParams extends MutationParams {
  channelId: string;
  interest: AddChannelInterest;
}

export const AddChannelInterest = async ({
  channelId,
  interest,
  clientApiParams,
}: AddChannelInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Interest>>(
    `/channels/managed/${channelId}/interests`,
    interest
  );

  return data;
};

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
