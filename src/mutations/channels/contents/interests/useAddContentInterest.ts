import { ConnectedXMResponse, Interest } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface AddContentInterestPayload {
  name: string;
}

export interface AddContentInterestParams extends MutationParams {
  channelId: string;
  contentId: string;
  interest: AddContentInterestPayload;
}

export const AddContentInterest = async ({
  channelId,
  contentId,
  interest,
  clientApiParams,
}: AddContentInterestParams): Promise<ConnectedXMResponse<Interest>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Interest>>(
    `/channels/${channelId}/contents/${contentId}/interests`,
    interest
  );

  return data;
};

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
