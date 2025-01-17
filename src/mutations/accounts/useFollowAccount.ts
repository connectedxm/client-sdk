import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import {
  ACCOUNT_FOLLOW_STATS_QUERY_KEY,
  ACCOUNT_FOLLOWERS_QUERY_KEY,
} from "@src/queries";
import { Account, ConnectedXMResponse } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { ADD_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";
import { produce } from "immer";

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
    queryClient.setQueryData(
      [...ACCOUNT_FOLLOW_STATS_QUERY_KEY(data.data.id), clientApiParams.locale],
      (prev: ConnectedXMResponse<{ followers: number; following: number }>) =>
        produce(prev, (data) => {
          if (data?.data) {
            data.data.followers = data.data.followers + 1;
          }
        })
    );
    queryClient.setQueryData(
      [
        ...ACCOUNT_FOLLOW_STATS_QUERY_KEY(data.data.username),
        clientApiParams.locale,
      ],
      (prev: ConnectedXMResponse<{ followers: number; following: number }>) =>
        produce(prev, (data) => {
          if (data?.data) {
            data.data.followers = data.data.followers + 1;
          }
        })
    );
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWERS_QUERY_KEY(data.data.id),
    });
    ADD_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "accounts",
      data.data.id
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
