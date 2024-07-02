import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MEMBERS_QUERY_KEY } from "@src/queries";

export interface DeleteThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
}

export const DeleteThreadMember = async ({
  threadId,
  accountId,
  clientApiParams,
  queryClient,
}: DeleteThreadMemberParams): Promise<ConnectedXMResponse<null>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.delete<ConnectedXMResponse<null>>(
    `/threads/${threadId}/members/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
  }

  return data;
};

export const useDeleteThreadMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteThreadMember>>,
      Omit<DeleteThreadMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadMemberParams,
    Awaited<ReturnType<typeof DeleteThreadMember>>
  >(DeleteThreadMember, options);
};
