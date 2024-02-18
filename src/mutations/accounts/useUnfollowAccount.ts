import useConnectedMutation, {
  MutationParams,
  MutationOptions,
} from "../useConnectedMutation";
import {
  ACCOUNT_FOLLOWERS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";
import { ConnectedXMResponse, Account } from "@src/interfaces";

export interface UnfollowAccountParams extends MutationParams {
  accountId: string;
}

export const UnfollowAccount = async ({
  accountId,
  clientApi,
  queryClient,
  locale = "en",
}: UnfollowAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/unfollow`
  );

  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [data.data.id], data, [locale]);
    SET_ACCOUNT_QUERY_DATA(queryClient, [data.data.username], data, [locale]);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_FOLLOWERS_QUERY_KEY(data.data.id),
    });
  }

  return data;
};

export const useUnfollowAccount = (
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof UnfollowAccount>>,
      Omit<UnfollowAccountParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UnfollowAccountParams,
    Awaited<ReturnType<typeof UnfollowAccount>>
  >(UnfollowAccount, params, options);
};
