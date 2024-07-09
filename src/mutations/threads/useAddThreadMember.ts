import { GetClientAPI } from "@src/ClientAPI";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "@src/mutations/useConnectedMutation";
import { THREAD_MEMBERS_QUERY_KEY } from "@src/queries";

export interface AddThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
  role: "moderator" | "member";
}

export const AddThreadMember = async ({
  threadId,
  accountId,
  role,
  clientApiParams,
  queryClient,
}: AddThreadMemberParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<ThreadMember>>(
    `/threads/${threadId}/members/${accountId}`,
    {
      role,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
  }

  return data;
};

export const useAddThreadMember = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddThreadMember>>,
      Omit<AddThreadMemberParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddThreadMemberParams,
    Awaited<ReturnType<typeof AddThreadMember>>
  >(AddThreadMember, options);
};
