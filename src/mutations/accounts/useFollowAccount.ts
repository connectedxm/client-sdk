import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  ACCOUNT_FOLLOWERS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";

export interface FollowAccountParams extends MutationParams {
  accountId: string;
}

export const FollowAccount = async ({
  accountId,
  clientApiParams,
  queryClient,
}: FollowAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/follow`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [data.data.id], data, [
      clientApiParams.locale,
    ]);
    SET_ACCOUNT_QUERY_DATA(queryClient, [data.data.username], data, [
      clientApiParams.locale,
    ]);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWERS_QUERY_KEY(data.data.id),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "accounts",
      accountId
    );
  }

  return data;
};

export const useFollowAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof FollowAccount>>,
      Omit<FollowAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    FollowAccountParams,
    Awaited<ReturnType<typeof FollowAccount>>
  >(FollowAccount, options);
};
