import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  ACCOUNT_FOLLOWERS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";
import { Account, ConnectedXMResponse } from "@src/interfaces";

interface FollowAccountParams extends MutationParams {
  accountId: string;
}

export const FollowAccount = async ({
  accountId,
  clientApi,
  queryClient,
}: FollowAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/follow`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [data.data.id], data);
    SET_ACCOUNT_QUERY_DATA(queryClient, [data.data.username], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWERS_QUERY_KEY(data.data.id),
    });
  }

  return data;
};

export const useFollowAccount = (
  options: MutationOptions<
    Awaited<ReturnType<typeof FollowAccount>>,
    FollowAccountParams
  > = {}
) => {
  return useConnectedMutation<
    FollowAccountParams,
    Awaited<ReturnType<typeof FollowAccount>>
  >((params) => FollowAccount({ ...params }), options);
};
