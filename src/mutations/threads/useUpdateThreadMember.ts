import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MEMBERS_QUERY_KEY, THREAD_QUERY_KEY } from "@src/queries";

export interface UpdateThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
  role?: string;
}

export const UpdateThreadMember = async ({
  threadId,
  accountId,
  role,
  clientApiParams,
  queryClient,
}: UpdateThreadMemberParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.patch<ConnectedXMResponse<ThreadMember>>(
    `/threads/${threadId}/members/${accountId}`,
    {
      role,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
    queryClient.invalidateQueries({
      queryKey: THREAD_QUERY_KEY(threadId),
    });
  }

  return data;
};

export const useUpdateThreadMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UpdateThreadMember>>,
      Omit<UpdateThreadMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadMemberParams,
    Awaited<ReturnType<typeof UpdateThreadMember>>
  >(UpdateThreadMember, options);
};
