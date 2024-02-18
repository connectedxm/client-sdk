import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";

export interface CreateTeamAccountParams extends MutationParams {
  name: string;
  email: string;
}

export const CreateTeamAccount = async ({
  name,
  email,
  clientApi,
}: CreateTeamAccountParams): Promise<ConnectedXMResponse<Account>> => {
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
  params: Omit<MutationParams, "queryClient" | "clientApi"> = {},
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateTeamAccount>>,
      Omit<CreateTeamAccountParams, "queryClient" | "clientApi">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateTeamAccountParams,
    Awaited<ReturnType<typeof CreateTeamAccount>>
  >(CreateTeamAccount, params, options);
};
