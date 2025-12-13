import { GetClientAPI } from "@src/ClientAPI";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Self
 */
export interface DeleteSelfParams extends MutationParams {}

/**
 * @category Methods
 * @group Self
 */
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

/**
 * @category Mutations
 * @group Self
 */
export const useDeleteSelf = (
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
  >(DeleteSelf, options);
};
