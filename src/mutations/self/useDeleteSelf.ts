import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

export interface DeleteSelfParams extends MutationParams {}

export const DeleteSelf = async ({
  clientApi,
  queryClient,
}: DeleteSelfParams) => {
  const { data } = await clientApi.delete(`/self`);
  // await Auth.signOut();
  if (queryClient && data.status === "ok") {
    queryClient.clear();
  }
  return data;
};

export const useDeleteSelf = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteSelf>>,
      Omit<DeleteSelfParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteSelfParams,
    Awaited<ReturnType<typeof DeleteSelf>>
  >(DeleteSelf, params, options);
};
