import { Group, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

import { GROUP_QUERY_KEY, GROUPS_QUERY_KEY } from "@src/queries";
import { GetClientAPI } from "@src/ClientAPI";
import { SetSingleQueryData } from "@src/utilities/SingleQueryHelpers";
export interface UpdateGroupParams extends MutationParams {
  groupId: string;
  group: {
    name?: string;
    active?: boolean;
    description?: string;
    externalUrl?: string;
    access?: "public" | "private";
  };
  imageDataUri?: string;
}

export const UpdateGroup = async ({
  groupId,
  group,
  imageDataUri,
  clientApiParams,
  queryClient,
}: UpdateGroupParams): Promise<ConnectedXMResponse<Group>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.put<ConnectedXMResponse<Group>>(
    `/groups/${groupId}`,
    {
      group,
      imageDataUri,
    }
  );

  if (queryClient && data.status === "ok") {
    SetSingleQueryData(
      queryClient,
      GROUP_QUERY_KEY(data.data.id),
      clientApiParams.locale,
      data
    );
    queryClient.invalidateQueries({
      queryKey: GROUPS_QUERY_KEY(),
    });
  }

  return data;
};

export const useUpdateGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateGroup>>,
      Omit<UpdateGroupParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateGroupParams,
    Awaited<ReturnType<typeof UpdateGroup>>
  >(UpdateGroup, options);
};
