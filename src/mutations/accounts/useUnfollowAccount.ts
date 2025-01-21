import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  ACCOUNT_FOLLOW_STATS_QUERY_KEY,
  ACCOUNT_FOLLOWERS_QUERY_KEY,
} from "@src/queries";
import { ConnectedXMResponse, Account } from "@src/interfaces";
import { GetClientAPI } from "@src/ClientAPI";
import { REMOVE_SELF_RELATIONSHIP } from "@src/queries/self/useGetSelfRelationships";
import { produce } from "immer";

export interface UnfollowAccountParams extends MutationParams {
  accountId: string;
}

export const UnfollowAccount = async ({
  accountId,
  clientApiParams,
  queryClient,
}: UnfollowAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/unfollow`
  );

  if (queryClient && data.status === "ok") {
    queryClient.setQueryData(
      [...ACCOUNT_FOLLOW_STATS_QUERY_KEY(data.data.id), clientApiParams.locale],
      (prev: ConnectedXMResponse<{ followers: number; following: number }>) =>
        produce(prev, (data) => {
          if (data?.data) {
            data.data.followers = data.data.followers - 1;
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
            data.data.followers = data.data.followers - 1;
          }
        })
    );
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWERS_QUERY_KEY(data.data.id),
    });
    REMOVE_SELF_RELATIONSHIP(
      queryClient,
      [clientApiParams.locale],
      "accounts",
      data.data.id
    );
  }

  return data;
};

export const useUnfollowAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnfollowAccount>>,
      Omit<UnfollowAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnfollowAccountParams,
    Awaited<ReturnType<typeof UnfollowAccount>>
  >(UnfollowAccount, options);
};
