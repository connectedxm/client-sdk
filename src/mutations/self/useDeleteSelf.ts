import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

export interface DeleteSelfParams extends MutationParams {}

export const DeleteSelf = async ({
  clientApiParams,
  queryClient,
}: DeleteSelfParams) => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete(`/self`);
  // await Auth.signOut();
  if (queryClient && data.status === "ok") {
    queryClient.clear();
  }
  return data;
};

export const useDeleteSelf = (
  params: Omit<MutationParams, "queryClient" | "clientApiParams"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelf>>,
      Omit<DeleteSelfParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfParams,
    Awaited<ReturnType<typeof DeleteSelf>>
  >(DeleteSelf, params, options);
};
