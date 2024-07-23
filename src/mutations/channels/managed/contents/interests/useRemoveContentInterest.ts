import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../../../../useConnectedMutation";

import { GetClientAPI } from "@src/ClientAPI";

export interface RemoveContentInterestParams extends MutationParams {
  channelId: string;
  contentId: string;
  interestId: string;
}

export const RemoveContentInterest = async ({
  channelId,
  contentId,
  interestId,
  clientApiParams,
}: RemoveContentInterestParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<null>>(
    `/channels/managed/${channelId}/contents/${contentId}/interests/${interestId}`
  );

  return data;
};

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
