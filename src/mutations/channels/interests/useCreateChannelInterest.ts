import { ConnectedXMResponse, Interest } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface AddChannelInterestPayload {
  name: string;
}

export interface AddChannelInterestParams extends MutationParams {
  channelId: string;
  interest: AddChannelInterestPayload;
}

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
