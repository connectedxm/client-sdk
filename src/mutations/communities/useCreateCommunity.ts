import {
  Community,
  CommunityAccess,
  ConnectedXMResponse,
} from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { COMMUNITIES_QUERY_KEY, SET_COMMUNITY_QUERY_DATA } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";

interface CreateCommunity {
  name: string;
  description: string;
  access: keyof typeof CommunityAccess;
  externalUrl?: string;
}

export interface CreateCommunityParams extends MutationParams {
  community: CreateCommunity;
  imageDataUri?: string;
}

export const CreateCommunity = async ({
  community,
  imageDataUri,
  clientApiParams,
  queryClient,
}: CreateCommunityParams): Promise<ConnectedXMResponse<Community>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Community>>(
    `/communities`,
    {
      community,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_COMMUNITY_QUERY_DATA(queryClient, [data.data.id], data);
    queryClient.invalidateQueries({
      queryKey: COMMUNITIES_QUERY_KEY(),
    });
  }

  return data;
};

export const useCreateCommunity = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateCommunity>>,
      Omit<CreateCommunityParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateCommunityParams,
    Awaited<ReturnType<typeof CreateCommunity>>
  >(CreateCommunity, options);
};
