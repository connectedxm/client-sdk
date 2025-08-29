import { Account, ConnectedXMResponse } from "@src/interfaces";
import useConnectedMutation, {
  MutationOptions,
  MutationParams,
} from "../useConnectedMutation";
import { GetClientAPI } from "@src/ClientAPI";

export interface CreateLoginAccountParams extends MutationParams {
  featured?: boolean;
  email: string;
  firstName?: string;
  lastName?: string;
  imageId?: string;
  bannerId?: string;
  username: string;
  phone?: string;
  title?: string;
  company?: string;
  bio?: string;
  website?: string;
  video?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  tikTok?: string;
  linkedIn?: string;
  youtube?: string;
  discord?: string;
  dietaryRestrictions?: string;
  locale?: string;
  termsAccepted?: Date;
}

export const CreateLoginAccount = async ({
  clientApiParams,
  ...accountData
}: CreateLoginAccountParams): Promise<ConnectedXMResponse<Account>> => {
  const clientApi = await GetClientAPI(clientApiParams);
  const { data } = await clientApi.post<ConnectedXMResponse<Account>>(
    `/login/account`,
    accountData
  );

  return data;
};

export const useCreateLoginAccount = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof CreateLoginAccount>>,
      Omit<CreateLoginAccountParams, "queryClient" | "clientApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateLoginAccountParams,
    Awaited<ReturnType<typeof CreateLoginAccount>>
  >(CreateLoginAccount, options);
};
