import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";
import { TeamAccountCreateInputs } from "@src/params";

export interface CreateTeamAccountParams extends MutationParams {
  teamAccount: TeamAccountCreateInputs;
}

export const CreateTeamAccount = async ({
  teamAccount: { name, email },
  clientApiParams,
}: CreateTeamAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/self/team`,
    {
      name,
      email,
    }
  );

  return data;
};

export const useCreateTeamAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateTeamAccount>>,
      Omit<CreateTeamAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateTeamAccountParams,
    Awaited<ReturnType<typeof CreateTeamAccount>>
  >(CreateTeamAccount, options);
};
